import { useEffect, useMemo, useRef, useState } from "react";
import { GoogleMap, useJsApiLoader, MarkerF } from "@react-google-maps/api";
import { useAuth } from "../auth/AuthProvider";
import { GOOGLE_MAPS_LIBRARIES } from "../lib/googleMaps";
import {
  createEvent,
  getMyEvents,
  recordCompletion,
  getMyParticipations,
} from "../api/eventsApi";

const MAP_PICKER_CONTAINER_STYLE = { width: "100%", height: "260px" };
const DEFAULT_PICKER_CENTER = { lat: 29.6516, lng: -82.3248 };

const EMPTY_EVENT_FORM = {
  name: "",
  date: "",
  description: "",
  duration: "",
  maxPeople: "",
  address: "",
  latitude: null,
  longitude: null,
};

const EMPTY_COMPLETION_FORM = {
  volunteerEmail: "",
  eventName: "",
  completionDate: "",
  hoursEarned: "",
};

function Account() {
  const { user, loading } = useAuth();
  const isOrganization = user?.accountType === "organization";
  const isVolunteer = user?.accountType === "volunteer";

  const [eventForm, setEventForm] = useState(EMPTY_EVENT_FORM);
  const [eventSubmitting, setEventSubmitting] = useState(false);
  const [eventError, setEventError] = useState(null);
  const [eventSuccess, setEventSuccess] = useState(null);

  const [completionForm, setCompletionForm] = useState(EMPTY_COMPLETION_FORM);
  const [completionSubmitting, setCompletionSubmitting] = useState(false);
  const [completionError, setCompletionError] = useState(null);
  const [completionSuccess, setCompletionSuccess] = useState(null);

  const [myEvents, setMyEvents] = useState([]);
  const [myParticipations, setMyParticipations] = useState([]);
  const addressContainerRef = useRef(null);
  const placeAutocompleteRef = useRef(null);

  const { isLoaded: mapLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? "",
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  useEffect(() => {
    if (!isOrganization) return;
    let cancelled = false;
    getMyEvents()
      .then((events) => {
        if (!cancelled) setMyEvents(events);
      })
      .catch(() => {
        if (!cancelled) setMyEvents([]);
      });
    return () => {
      cancelled = true;
    };
  }, [isOrganization]);

  useEffect(() => {
    if (!isVolunteer) return;
    let cancelled = false;
    getMyParticipations()
      .then((docs) => {
        if (!cancelled) setMyParticipations(docs);
      })
      .catch(() => {
        if (!cancelled) setMyParticipations([]);
      });
    return () => {
      cancelled = true;
    };
  }, [isVolunteer]);

  const totalHours = useMemo(
    () =>
      myParticipations.reduce(
        (sum, p) => sum + (Number(p.hoursEarned) || 0),
        0
      ),
    [myParticipations]
  );

  const eventFormValid =
    eventForm.name.trim() &&
    eventForm.date &&
    eventForm.description.trim() &&
    eventForm.address.trim() &&
    eventForm.duration !== "" &&
    Number(eventForm.duration) >= 0 &&
    eventForm.latitude !== null &&
    eventForm.longitude !== null;

  const completionFormValid =
    completionForm.volunteerEmail.trim() &&
    completionForm.eventName.trim() &&
    completionForm.completionDate &&
    completionForm.hoursEarned !== "" &&
    Number(completionForm.hoursEarned) >= 0;

  function handleEventFieldChange(field, value) {
    setEventForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleMapClick(e) {
    const lat = e.latLng?.lat();
    const lng = e.latLng?.lng();
    if (typeof lat !== "number" || typeof lng !== "number") return;
    setEventForm((prev) => ({ ...prev, latitude: lat, longitude: lng }));

    if (window.google?.maps?.Geocoder) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === "OK" && results?.[0]?.formatted_address) {
          setEventForm((prev) => ({
            ...prev,
            address: results[0].formatted_address,
          }));
        }
      });
    }
  }

  useEffect(() => {
    if (!mapLoaded || !isOrganization) return;
    const container = addressContainerRef.current;
    if (!container) return;
    if (!window.google?.maps?.places?.PlaceAutocompleteElement) return;
    if (placeAutocompleteRef.current) return;

    const el = new window.google.maps.places.PlaceAutocompleteElement({});
    el.style.width = "100%";
    placeAutocompleteRef.current = el;
    container.appendChild(el);

    const onSelect = async (event) => {
      const prediction = event?.placePrediction;
      if (!prediction) return;
      try {
        const place = prediction.toPlace();
        await place.fetchFields({ fields: ["formattedAddress", "location"] });
        const loc = place.location;
        setEventForm((prev) => ({
          ...prev,
          address: place.formattedAddress || prev.address,
          latitude: loc ? loc.lat() : prev.latitude,
          longitude: loc ? loc.lng() : prev.longitude,
        }));
      } catch {
        // swallow: validation will keep submit disabled if lat/lng never set
      }
    };

    el.addEventListener("gmp-select", onSelect);

    return () => {
      el.removeEventListener("gmp-select", onSelect);
      el.remove();
      placeAutocompleteRef.current = null;
    };
  }, [mapLoaded, isOrganization]);

  async function handleCreateEvent(e) {
    e.preventDefault();
    setEventError(null);
    setEventSuccess(null);
    if (!eventFormValid) {
      setEventError("Please fill in all required fields and pick a location on the map.");
      return;
    }
    setEventSubmitting(true);
    try {
      const payload = {
        name: eventForm.name.trim(),
        description: eventForm.description.trim(),
        address: eventForm.address.trim(),
        date: eventForm.date,
        duration: Number(eventForm.duration),
        latitude: eventForm.latitude,
        longitude: eventForm.longitude,
      };
      if (eventForm.maxPeople !== "") {
        payload.maxPeople = Number(eventForm.maxPeople);
      }
      await createEvent(payload);
      setEventSuccess("Event created.");
      setEventForm(EMPTY_EVENT_FORM);
      const refreshed = await getMyEvents();
      setMyEvents(refreshed);
    } catch (err) {
      setEventError(err?.message || "Failed to create event.");
    } finally {
      setEventSubmitting(false);
    }
  }

  function handleCompletionFieldChange(field, value) {
    setCompletionForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleRecordCompletion(e) {
    e.preventDefault();
    setCompletionError(null);
    setCompletionSuccess(null);
    if (!completionFormValid) {
      setCompletionError("Please fill in all required fields.");
      return;
    }
    setCompletionSubmitting(true);
    try {
      await recordCompletion({
        volunteerEmail: completionForm.volunteerEmail.trim(),
        eventName: completionForm.eventName.trim(),
        completionDate: completionForm.completionDate,
        hoursEarned: Number(completionForm.hoursEarned),
      });
      setCompletionSuccess("Completion recorded.");
      setCompletionForm(EMPTY_COMPLETION_FORM);
    } catch (err) {
      setCompletionError(err?.message || "Failed to record completion.");
    } finally {
      setCompletionSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="account-page">
        <section className="py-5">
          <div className="container">
            <p className="text-center text-secondary">Loading...</p>
          </div>
        </section>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="account-page">
        <section className="py-5">
          <div className="container">
            <p className="text-center text-secondary">You are not signed in.</p>
          </div>
        </section>
      </main>
    );
  }

  const categories = Array.isArray(user.categories) ? user.categories : [];
  const pickerCenter =
    eventForm.latitude !== null && eventForm.longitude !== null
      ? { lat: eventForm.latitude, lng: eventForm.longitude }
      : DEFAULT_PICKER_CENTER;

  return (
    <main className="account-page">
      <section className="py-5">
        <div className="container">
          <div className="account-header text-center mb-5">
            <h1 className="fw-bold mb-3">Account</h1>
            <p className="account-subtext text-secondary">
              {isOrganization
                ? "Manage your organization profile, create events, and record volunteer completions."
                : "View your profile information and completed volunteer opportunities."}
            </p>
          </div>

          {!isOrganization && (
            <div className="account-summary-card mb-4">
              <h2 className="fw-semibold mb-2">Total Volunteer Hours</h2>
              <p className="account-hours mb-0">{totalHours}</p>
            </div>
          )}

          <div className="account-info-card mb-5">
            <h2 className="fw-semibold mb-4">
              {isOrganization ? "Organization Information" : "Profile Information"}
            </h2>

            <div className="row g-4">
              {isOrganization ? (
                <div className="col-12 col-md-6">
                  <p className="account-label mb-1">Organization Name</p>
                  <p className="mb-0">{user.organizationName || "N/A"}</p>
                </div>
              ) : (
                <>
                  <div className="col-12 col-md-6">
                    <p className="account-label mb-1">First Name</p>
                    <p className="mb-0">{user.firstName || "N/A"}</p>
                  </div>

                  <div className="col-12 col-md-6">
                    <p className="account-label mb-1">Last Name</p>
                    <p className="mb-0">{user.lastName || "N/A"}</p>
                  </div>
                </>
              )}

              <div className="col-12 col-md-6">
                <p className="account-label mb-1">Email</p>
                <p className="mb-0">{user.email}</p>
              </div>

              <div className="col-12 col-md-6">
                <p className="account-label mb-1">Phone</p>
                <p className="mb-0">{user.phone || "N/A"}</p>
              </div>

              <div className="col-12 col-md-6">
                <p className="account-label mb-1">Account Type</p>
                <p className="mb-0 text-capitalize">{user.accountType}</p>
              </div>

              {isOrganization && (
                <>
                  <div className="col-12">
                    <p className="account-label mb-1">Description</p>
                    <p className="mb-0">{user.description || "N/A"}</p>
                  </div>

                  <div className="col-12 col-md-8">
                    <p className="account-label mb-1">Categories</p>
                    <p className="mb-0">
                      {categories.length > 0 ? categories.join(", ") : "None"}
                    </p>
                  </div>

                  <div className="col-12 col-md-4">
                    <p className="account-label mb-1">Verification Status</p>
                    <p className="mb-0">
                      {user.verified ? "Verified" : "Not Verified"}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {isOrganization && (
            <>
              <div className="account-info-card mb-5">
                <h2 className="fw-semibold mb-4">Create Event</h2>

                {eventError && (
                  <div className="alert alert-danger" role="alert">
                    {eventError}
                  </div>
                )}
                {eventSuccess && (
                  <div className="alert alert-success" role="alert">
                    {eventSuccess}
                  </div>
                )}

                <form onSubmit={handleCreateEvent} noValidate>
                  <div className="row g-4">
                    <div className="col-12 col-md-6">
                      <label className="account-label mb-1 d-block">Event Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="event name..."
                        value={eventForm.name}
                        onChange={(e) => handleEventFieldChange("name", e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="account-label mb-1 d-block">Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={eventForm.date}
                        onChange={(e) => handleEventFieldChange("date", e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label className="account-label mb-1 d-block">Description</label>
                      <textarea
                        className="form-control"
                        rows="4"
                        placeholder="Add a description for your event..."
                        value={eventForm.description}
                        onChange={(e) => handleEventFieldChange("description", e.target.value)}
                        required
                      ></textarea>
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="account-label mb-1 d-block">Duration (Hours)</label>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        className="form-control"
                        placeholder="0"
                        value={eventForm.duration}
                        onChange={(e) => handleEventFieldChange("duration", e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="account-label mb-1 d-block">Max People</label>
                      <input
                        type="number"
                        min="1"
                        className="form-control"
                        placeholder="30"
                        value={eventForm.maxPeople}
                        onChange={(e) => handleEventFieldChange("maxPeople", e.target.value)}
                      />
                    </div>

                    <div className="col-12">
                      <label className="account-label mb-1 d-block">Address</label>
                      <div ref={addressContainerRef} className="place-autocomplete-host" />
                      {!mapLoaded && (
                        <p className="text-secondary small mt-2 mb-0">Loading address search...</p>
                      )}
                      {eventForm.address && (
                        <p className="text-secondary small mt-2 mb-0">
                          Selected: {eventForm.address}
                        </p>
                      )}
                    </div>

                    <div className="col-12">
                      <label className="account-label mb-1 d-block">
                        Pick Event Location (click on the map)
                      </label>
                      {mapLoaded ? (
                        <GoogleMap
                          mapContainerStyle={MAP_PICKER_CONTAINER_STYLE}
                          center={pickerCenter}
                          zoom={12}
                          onClick={handleMapClick}
                        >
                          {eventForm.latitude !== null && eventForm.longitude !== null && (
                            <MarkerF
                              position={{
                                lat: eventForm.latitude,
                                lng: eventForm.longitude,
                              }}
                            />
                          )}
                        </GoogleMap>
                      ) : (
                        <p className="text-secondary mb-0">Loading map...</p>
                      )}
                      <p className="text-secondary small mt-2 mb-0">
                        {eventForm.latitude !== null && eventForm.longitude !== null
                          ? `Selected: ${eventForm.latitude.toFixed(5)}, ${eventForm.longitude.toFixed(5)}`
                          : "No location selected yet."}
                      </p>
                    </div>

                    <div className="col-12">
                      <button
                        type="submit"
                        className="btn btn-dark px-4"
                        disabled={!eventFormValid || eventSubmitting}
                      >
                        {eventSubmitting ? "Creating..." : "Create Event"}
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              <div className="account-info-card mb-5">
                <h2 className="fw-semibold mb-4">Record Volunteer Completion</h2>

                {completionError && (
                  <div className="alert alert-danger" role="alert">
                    {completionError}
                  </div>
                )}
                {completionSuccess && (
                  <div className="alert alert-success" role="alert">
                    {completionSuccess}
                  </div>
                )}

                <form onSubmit={handleRecordCompletion} noValidate>
                  <div className="row g-4">
                    <div className="col-12 col-md-6">
                      <label className="account-label mb-1 d-block">Volunteer Email</label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="email@example.com"
                        value={completionForm.volunteerEmail}
                        onChange={(e) =>
                          handleCompletionFieldChange("volunteerEmail", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="account-label mb-1 d-block">Event Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="event name..."
                        value={completionForm.eventName}
                        onChange={(e) =>
                          handleCompletionFieldChange("eventName", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="account-label mb-1 d-block">Completion Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={completionForm.completionDate}
                        onChange={(e) =>
                          handleCompletionFieldChange("completionDate", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="account-label mb-1 d-block">Service Hours</label>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        className="form-control"
                        placeholder="0"
                        value={completionForm.hoursEarned}
                        onChange={(e) =>
                          handleCompletionFieldChange("hoursEarned", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div className="col-12">
                      <button
                        type="submit"
                        className="btn btn-dark px-4"
                        disabled={!completionFormValid || completionSubmitting}
                      >
                        {completionSubmitting ? "Saving..." : "Save Completion"}
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              <div className="completed-section">
                <h2 className="fw-semibold mb-4">Current Events</h2>

                <div className="completed-list">
                  {myEvents.length === 0 ? (
                    <p className="text-secondary mb-0">No events created yet.</p>
                  ) : (
                    <div className="row g-4">
                      {myEvents.map((event) => {
                        const dateStr = event.date
                          ? new Date(event.date).toLocaleDateString()
                          : "";
                        return (
                          <div key={event._id} className="col-12 col-md-6 col-xl-4">
                            <div className="completed-card h-100">
                              <h3 className="fw-bold mb-2">{event.name}</h3>
                              <p className="text-secondary mb-2">
                                {dateStr} • {event.duration} hour
                                {event.duration !== 1 ? "s" : ""}
                              </p>
                              <p className="mb-2">{event.description}</p>
                              <p className="mb-1">
                                <strong>Address:</strong> {event.address}
                              </p>
                              {typeof event.maxPeople === "number" && (
                                <p className="mb-1">
                                  <strong>Spots:</strong>{" "}
                                  {event.currentPeople ?? 0} / {event.maxPeople}
                                </p>
                              )}
                              <p className="mb-0">
                                <strong>Status:</strong> {event.status}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {!isOrganization && (
            <div className="completed-section">
              <h2 className="fw-semibold mb-4">Completed Opportunities</h2>

              <div className="completed-list">
                {myParticipations.length === 0 ? (
                  <p className="text-secondary mb-0">No completed opportunities yet.</p>
                ) : (
                  myParticipations.map((item) => {
                    const eventName = item.eventID?.name || "Event";
                    const completedDate = item.arrivalTime
                      ? new Date(item.arrivalTime).toLocaleDateString()
                      : "";
                    return (
                      <div key={item._id} className="completed-card">
                        <div className="row g-4 align-items-center">
                          <div className="col-12">
                            <h3 className="fw-bold mb-2">{eventName}</h3>
                            <p className="text-secondary mb-2">
                              Completed on {completedDate}
                            </p>
                            <p className="mb-0">
                              <strong>Hours Earned:</strong> {item.hoursEarned}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default Account;
