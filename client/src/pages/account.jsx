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

  return (
    <main className="account-page">
      <section className="py-5">
        <div className="container">
          <div className="account-header text-center mb-5">
            <h1 className="fw-bold mb-3">Account</h1>
            <p className="account-subtext text-secondary">
              View your profile information and completed volunteer opportunities.
            </p>
          </div>

          {!isOrganization && (
            <div className="account-summary-card mb-4">
              <h2 className="fw-semibold mb-2">Total Volunteer Hours</h2>
              <p className="account-hours mb-0">{totalHours}</p>
            </div>
          )}

          <div className="account-info-card mb-5">
            <h2 className="fw-semibold mb-4">Profile Information</h2>

            <div className="row g-4">
              {isOrganization ? (
                <div className="col-12">
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
            </div>
          </div>

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
