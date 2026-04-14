function Account() {
  const exampleUser = {
    username: "lukeB",
    firstName: "Luke",
    lastName: "Barcenas",
    email: "luke@gmail.com",
    phone: "",
    completedOpportunities: [
      {
        id: 1,
        eventName: "Event1",
        completedDate: "2026-03-10",
        hours: 3,
        certificateImage: "Certificate Placeholder",
      },
      {
        id: 2,
        eventName: "Event2",
        completedDate: "2026-03-15",
        hours: 4,
        certificateImage: "Certificate Placeholder",
      },
      {
        id: 3,
        eventName: "Event3",
        completedDate: "2026-03-20",
        hours: 2.5,
        certificateImage: "Certificate Placeholder",
      },
    ],
  };

  const totalHours = exampleUser.completedOpportunities.reduce(
    (sum, item) => sum + item.hours,
    0
  );

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

          <div className="account-summary-card mb-4">
            <h2 className="fw-semibold mb-2">Total Volunteer Hours</h2>
            <p className="account-hours mb-0">{totalHours}</p>
          </div>

          <div className="account-info-card mb-5">
            <h2 className="fw-semibold mb-4">Profile Information</h2>

            <div className="row g-4">
              <div className="col-12 col-md-6">
                <p className="account-label mb-1">First Name</p>
                <p className="mb-0">{exampleUser.firstName}</p>
              </div>

              <div className="col-12 col-md-6">
                <p className="account-label mb-1">Last Name</p>
                <p className="mb-0">{exampleUser.lastName}</p>
              </div>

              <div className="col-12 col-md-6">
                <p className="account-label mb-1">Username</p>
                <p className="mb-0">{exampleUser.username}</p>
              </div>

              <div className="col-12 col-md-6">
                <p className="account-label mb-1">Email</p>
                <p className="mb-0">{exampleUser.email}</p>
              </div>

              <div className="col-12 col-md-6">
                <p className="account-label mb-1">Phone</p>
                <p className="mb-0">{exampleUser.phone || "N/A"}</p>
              </div>
            </div>
          </div>

          <div className="completed-section">
            <h2 className="fw-semibold mb-4">Completed Opportunities</h2>

            <div className="completed-list">
              {exampleUser.completedOpportunities.length === 0 ? (
                <p className="text-secondary mb-0">No completed opportunities yet.</p>
              ) : (
                exampleUser.completedOpportunities.map((item) => (
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
        </div>
      </section>
    </main>
  );
}

export default Account;