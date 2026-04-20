function Account() {

  const user1 = {
    accountType: "volunteer",
    firstName: "John",
    lastName: "Example",
    email: "john@example.com",
    phone: "",
    completedOpportunities: [
      {
        id: 1,
        eventName: "Beach Cleanup",
        completedDate: "2026-03-10",
        hours: 3,
        certificateImage: "Certificate Placeholder",
      },
      {
        id: 2,
        eventName: "Food Drive",
        completedDate: "2026-03-15",
        hours: 4,
        certificateImage: "Certificate Placeholder",
      },
    ],
  };

  const user2 = {
    accountType: "organization",
    organizationName: "Campus Impact UF",
    email: "contact@campusimpact.org",
    phone: "123-111-1111",
    description:
      "A student-led organization focused on service, sustainability, and campus involvement.",
    categories: ["Environment", "Community Service"],
    verified: false,
    currentEvents: [
      {
        id: 1,
        name: "Campus Cleanup",
        date: "2026-04-13",
        duration: 2,
        address: "1555 Inner Rd, Gainesville, FL 32611",
        maxPeople: 30,
        currentPeople: 12,
        status: "active",
        description: "Help pick up litter and beautify the UF campus.",
      },
    ],
  };

  // REPLACE WITH USER INFO FROM THE DB
  const user = user2;

  const totalHours =
    user.accountType === "volunteer"
      ? user.completedOpportunities.reduce(
          (sum, item) => sum + item.hours, 0) : 0;

  return (
    <main className="account-page">
      <section className="py-5">
        <div className="container">
          <div className="account-header text-center mb-5">
            <h1 className="fw-bold mb-3">Account</h1>
            <p className="account-subtext text-secondary mb-0">
              {user.accountType === "volunteer"
                ? "View your profile information and completed volunteer opportunities."
                : "Manage your organization profile, create events, and record volunteer completions."}
            </p>
          </div>

          {user.accountType === "volunteer" ? (
            <>
              <div className="account-summary-card mb-4">
                <h2 className="fw-semibold mb-2">Total Volunteer Hours</h2>
                <p className="account-hours mb-0">{totalHours}</p>
              </div>

              <div className="account-info-card mb-5">
                <h2 className="fw-semibold mb-4">Profile Information</h2>

                <div className="row g-4">
                  <div className="col-12 col-md-6">
                    <p className="account-label mb-1">Account Type</p>
                    <p className="mb-0 text-capitalize">{user.accountType}</p>
                  </div>

                  <div className="col-12 col-md-6">
                    <p className="account-label mb-1">Email</p>
                    <p className="mb-0">{user.email}</p>
                  </div>

                  <div className="col-12 col-md-6">
                    <p className="account-label mb-1">First Name</p>
                    <p className="mb-0">{user.firstName}</p>
                  </div>

                  <div className="col-12 col-md-6">
                    <p className="account-label mb-1">Last Name</p>
                    <p className="mb-0">{user.lastName}</p>
                  </div>

                  <div className="col-12 col-md-6">
                    <p className="account-label mb-1">Phone</p>
                    <p className="mb-0">{user.phone || "N/A"}</p>
                  </div>
                </div>
              </div>

                {user.accountType === "volunteer" && (
                  <div className="completed-section">
                    <h2 className="fw-semibold mb-4">Completed Opportunities</h2>

                    <div className="completed-list">
                      {user.completedOpportunities.length === 0 ? (
                        <p className="text-secondary mb-0">
                          No completed opportunities yet.
                        </p>
                      ) : (
                        user.completedOpportunities.map((item) => (
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
            </>
          ) : (
            <>
              <div className="account-info-card mb-5">
                <h2 className="fw-semibold mb-4">Organization Information</h2>

                <div className="row g-4">
                  <div className="col-12 col-md-6">
                    <p className="account-label mb-1">Account Type</p>
                    <p className="mb-0 text-capitalize">{user.accountType}</p>
                  </div>

                  <div className="col-12 col-md-6">
                    <p className="account-label mb-1">Organization Name</p>
                    <p className="mb-0">{user.organizationName}</p>
                  </div>

                  <div className="col-12 col-md-6">
                    <p className="account-label mb-1">Email</p>
                    <p className="mb-0">{user.email}</p>
                  </div>

                  <div className="col-12 col-md-6">
                    <p className="account-label mb-1">Phone</p>
                    <p className="mb-0">{user.phone || "N/A"}</p>
                  </div>

                  <div className="col-12">
                    <p className="account-label mb-1">Description</p>
                    <p className="mb-0">{user.description || "N/A"}</p>
                  </div>

                  <div className="col-12 col-md-8">
                    <p className="account-label mb-1">Categories</p>
                    <p className="mb-0">
                      {user.categories.length > 0
                        ? user.categories.join(", ")
                        : "None"}
                    </p>
                  </div>

                  <div className="col-12 col-md-4">
                    <p className="account-label mb-1">Verification Status</p>
                    <p className="mb-0">
                      {user.verified ? "Verified" : "Not Verified"}
                    </p>
                  </div>
                </div>
              </div>

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

              {user.accountType === "organization" && (
                <div className="completed-section">
                  <h2 className="fw-semibold mb-4">Current Events</h2>

                  <div className="completed-list">
                    {user.currentEvents.length === 0 ? (
                      <p className="text-secondary mb-0">No events created yet.</p>
                    ) : (
                      <div className="row g-4">
                        {user.currentEvents.map((event) => (
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
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}

export default Account;