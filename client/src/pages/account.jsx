import { useAuth } from "../auth/AuthProvider";

function Account() {
  const { user, loading } = useAuth();

  const completedOpportunities = [];
  const totalHours = completedOpportunities.reduce(
    (sum, item) => sum + item.hours,
    0
  );

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

  const isOrganization = user.accountType === "organization";
  const categories = Array.isArray(user.categories) ? user.categories : [];
  const currentEvents = Array.isArray(user.currentEvents) ? user.currentEvents : [];

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

                <form>
                  <div className="row g-4">
                    <div className="col-12 col-md-6">
                      <label className="account-label mb-1 d-block">Event Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="event name..."
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="account-label mb-1 d-block">Date</label>
                      <input type="date" className="form-control" />
                    </div>

                    <div className="col-12">
                      <label className="account-label mb-1 d-block">Description</label>
                      <textarea
                        className="form-control"
                        rows="4"
                        placeholder="Add a description for your event..."
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
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="account-label mb-1 d-block">Max People</label>
                      <input
                        type="number"
                        min="1"
                        className="form-control"
                        placeholder="30"
                      />
                    </div>

                    <div className="col-12">
                      <label className="account-label mb-1 d-block">Address</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="123 St, Gainesville, FL 32611"
                      />
                    </div>

                    <div className="col-12">
                      <button type="submit" className="btn btn-dark px-4">
                        Create Event
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              <div className="account-info-card mb-5">
                <h2 className="fw-semibold mb-4">Record Volunteer Completion</h2>

                <form>
                  <div className="row g-4">
                    <div className="col-12 col-md-6">
                      <label className="account-label mb-1 d-block">Volunteer Email</label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="email@example.com"
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="account-label mb-1 d-block">Event Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="event name..."
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="account-label mb-1 d-block">Completion Date</label>
                      <input type="date" className="form-control" />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="account-label mb-1 d-block">Service Hours</label>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        className="form-control"
                        placeholder="0"
                      />
                    </div>

                    <div className="col-12">
                      <label className="account-label mb-1 d-block">
                        Upload Certificate
                      </label>
                      <input type="file" className="form-control" />
                    </div>

                    <div className="col-12">
                      <button type="submit" className="btn btn-dark px-4">
                        Save Completion
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              <div className="completed-section">
                <h2 className="fw-semibold mb-4">Current Events</h2>

                <div className="completed-list">
                  {currentEvents.length === 0 ? (
                    <p className="text-secondary mb-0">No events created yet.</p>
                  ) : (
                    <div className="row g-4">
                      {currentEvents.map((event) => (
                        <div key={event.id} className="col-12 col-md-6 col-xl-4">
                          <div className="completed-card h-100">
                            <h3 className="fw-bold mb-2">{event.name}</h3>
                            <p className="text-secondary mb-2">
                              {event.date} • {event.duration} hour
                              {event.duration !== 1 ? "s" : ""}
                            </p>
                            <p className="mb-2">{event.description}</p>
                            <p className="mb-1">
                              <strong>Address:</strong> {event.address}
                            </p>
                            <p className="mb-1">
                              <strong>Spots:</strong> {event.currentPeople} / {event.maxPeople}
                            </p>
                            <p className="mb-0">
                              <strong>Status:</strong> {event.status}
                            </p>
                          </div>
                        </div>
                      ))}
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
                {completedOpportunities.length === 0 ? (
                  <p className="text-secondary mb-0">No completed opportunities yet.</p>
                ) : (
                  completedOpportunities.map((item) => (
                    <div key={item.id} className="completed-card">
                      <div className="row g-4 align-items-center">
                        <div className="col-12 col-md-8">
                          <h3 className="fw-bold mb-2">{item.eventName}</h3>
                          <p className="text-secondary mb-2">
                            Completed on {item.completedDate}
                          </p>
                          <p className="mb-0">
                            <strong>Hours Earned:</strong> {item.hours}
                          </p>
                        </div>

                        <div className="col-12 col-md-4">
                          <div className="certificate-placeholder">
                            {item.certificateImage}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
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
