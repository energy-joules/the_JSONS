import { useEffect, useState, useCallback, useRef } from "react";
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF } from "@react-google-maps/api";
import { getEvents, searchEventsApi } from "../api/eventsApi";

const DEFAULT_CENTER = { lat: 29.6516, lng: -82.3248 };
const MAP_CONTAINER_STYLE = { width: "100%", height: "100%" };
const SIDEBAR_MIN_WIDTH = 280;
const SIDEBAR_MAX_WIDTH = 720;
const SIDEBAR_DEFAULT_WIDTH = 420;

function MapPage() {
  const [searchInput, setSearchInput] = useState("");
  const [categoryInput, setCategoryInput] = useState("all");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_DEFAULT_WIDTH);
  const isResizingRef = useRef(false);
  const mapRef = useRef(null);

  useEffect(() => {
    function onMouseMove(e) {
      if (!isResizingRef.current) return;
      const next = Math.min(
        SIDEBAR_MAX_WIDTH,
        Math.max(SIDEBAR_MIN_WIDTH, e.clientX)
      );
      setSidebarWidth(next);
    }
    function onMouseUp() {
      if (isResizingRef.current) {
        isResizingRef.current = false;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      }
    }
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  function startResize(e) {
    e.preventDefault();
    isResizingRef.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? "",
  });

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {}
    );
  }, []);

  async function loadEvents() {
    setLoading(true);
    setError(null);
    try {
      const data = await getEvents();
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  async function handleSearch(event) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const q = searchInput.trim();
      const data = q ? await searchEventsApi(q) : await getEvents();
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function panToEvent(ev) {
    setSelectedEvent(ev);
    if (mapRef.current && ev.latitude != null && ev.longitude != null) {
      mapRef.current.panTo({ lat: ev.latitude, lng: ev.longitude });
      mapRef.current.setZoom(15);
    }
  }

  function formatDate(raw) {
    if (!raw) return "";
    const d = new Date(raw);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  }

  return (
    <main className="map-page">
      <section className="map-layout">
        <aside
          className={`map-sidebar${sidebarCollapsed ? " map-sidebar--collapsed" : ""}`}
          style={sidebarCollapsed ? undefined : { width: `${sidebarWidth}px` }}
        >
          <button
            type="button"
            className="map-sidebar-toggle"
            onClick={() => setSidebarCollapsed((v) => !v)}
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? "›" : "‹"}
          </button>
          <div className="map-sidebar-inner">
            <div className="map-sidebar-header">
              <h1 className="fw-bold mb-3">
                Nearby Opportunities ({results.length})
              </h1>

              <form onSubmit={handleSearch}>
                <div className="d-flex flex-column gap-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search opportunities"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />

                  <select
                    className="form-select"
                    value={categoryInput}
                    onChange={(e) => setCategoryInput(e.target.value)}
                  >
                    <option value="all">All Categories</option>
                    <option value="community">Community</option>
                    <option value="education">Education</option>
                    <option value="environment">Environment</option>
                    <option value="health">Health</option>
                  </select>

                  <button type="submit" className="btn btn-dark">
                    Search
                  </button>
                </div>
              </form>

              <div className="map-divider"></div>
            </div>

            <div className="nearby-results">
              {loading && (
                <p className="text-secondary mb-0">Loading...</p>
              )}

              {error && (
                <p className="text-danger mb-0">{error}</p>
              )}

              {!loading && !error && results.length === 0 && (
                <p className="text-secondary mb-0">No nearby opportunities found.</p>
              )}

              {!loading && !error && results.map((ev) => (
                <div
                  key={ev._id}
                  className={`map-result-card${selectedEvent?._id === ev._id ? " map-result-card--active" : ""}`}
                  onClick={() => panToEvent(ev)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && panToEvent(ev)}
                >
                  <h3 className="fw-bold mb-1">{ev.name}</h3>

                  <p className="mb-1 text-secondary">
                    {formatDate(ev.date)} &middot; {ev.duration}h
                  </p>

                  <p className="mb-1">{ev.address}</p>

                  <p className="mb-0 text-secondary">{ev.description}</p>

                  <div className="pt-2 mt-2 border-top border-light">
                    <p className="mb-2 small">
                      <strong>Spots:</strong>{" "}
                      {ev.currentPeople ?? 0}
                      {ev.maxPeople != null ? `/${ev.maxPeople}` : ""}
                    </p>
                    <div className="d-flex justify-content-end">
                      <button
                        type="button"
                        className="btn btn-dark btn-sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Sign up
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {!sidebarCollapsed && (
            <div
              className="map-sidebar-resizer"
              onMouseDown={startResize}
              role="separator"
              aria-orientation="vertical"
              aria-label="Resize sidebar"
            />
          )}
        </aside>

        <div className="map-view">
          {loadError && (
            <div className="map-placeholder">
              <div className="map-placeholder-inner">
                <h2 className="fw-bold mb-2">Map failed to load</h2>
                <p className="text-danger mb-0">{loadError.message}</p>
              </div>
            </div>
          )}

          {!isLoaded && !loadError && (
            <div className="map-placeholder">
              <div className="map-placeholder-inner">
                <p className="text-secondary mb-0">Loading map...</p>
              </div>
            </div>
          )}

          {isLoaded && !loadError && (
            <GoogleMap
              mapContainerStyle={MAP_CONTAINER_STYLE}
              center={userLocation ?? DEFAULT_CENTER}
              zoom={13}
              onLoad={onMapLoad}
              onClick={() => setSelectedEvent(null)}
            >
              {results.map((ev) =>
                ev.latitude != null && ev.longitude != null ? (
                  <MarkerF
                    key={ev._id}
                    position={{ lat: ev.latitude, lng: ev.longitude }}
                    onClick={() => setSelectedEvent(ev)}
                  />
                ) : null
              )}

              {selectedEvent && selectedEvent.latitude != null && (
                <InfoWindowF
                  position={{ lat: selectedEvent.latitude, lng: selectedEvent.longitude }}
                  onCloseClick={() => setSelectedEvent(null)}
                >
                  <div style={{ maxWidth: 240 }}>
                    <h6 className="fw-bold mb-1">{selectedEvent.name}</h6>
                    <p className="mb-1 small text-secondary">
                      {formatDate(selectedEvent.date)} &middot; {selectedEvent.duration}h
                    </p>
                    <p className="mb-2 small">{selectedEvent.address}</p>
                    <div className="pt-2 border-top">
                      <p className="mb-2 small">
                        <strong>Spots:</strong>{" "}
                        {selectedEvent.currentPeople ?? 0}
                        {selectedEvent.maxPeople != null
                          ? `/${selectedEvent.maxPeople}`
                          : ""}
                      </p>
                      <button type="button" className="btn btn-dark btn-sm w-100">
                        Sign up
                      </button>
                    </div>
                  </div>
                </InfoWindowF>
              )}
            </GoogleMap>
          )}
        </div>
      </section>
    </main>
  );
}

export default MapPage;