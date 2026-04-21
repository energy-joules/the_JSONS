import { Link } from "react-router-dom";

function Home() {
  return (
    <main className="home-page">
      <section className="py-5 text-center">
        <div className="container top-content">
          <h1 className="display-4 fw-bold mb-3">
            Find Opportunities Near You!
          </h1>

          <p className="lead mb-4 mx-auto text-center" style={{ maxWidth: "760px" }}>
            Use our interactive map to find nearby volunteering opportunities
            or log in as an organization to post openings.
          </p>

          <div className="d-flex flex-column flex-sm-row justify-content-center gap-3 mb-5">
            <Link
              to="/login"
              state={{ signup: true, accountType: "volunteer" }}
              className="btn btn-dark btn-lg px-4"
            >
              I’m a Volunteer
            </Link>

            <Link
              to="/login"
              state={{ signup: true, accountType: "organization" }}
              className="btn btn-outline-dark btn-lg px-4"
            >
              I’m an Organization
            </Link>
          </div>
        </div>
      </section>

      <section className="features-section py-5">
        <div className="container">
          <div className="row g-4 text-center">
            <div className="col-12 col-md-4">
              <h3 className="fw-bold mb-3">Local Opportunities</h3>
              <p className="text-secondary mb-0">
                Find nearby openings through the map or search and discover
                ways to help in your community.
              </p>
            </div>

            <div className="col-12 col-md-4">
              <h3 className="fw-bold mb-3">Connect with Organizations</h3>
              <p className="text-secondary mb-0">
                Make connections and volunteer for great organizations that
                align with your interests and goals.
              </p>
            </div>

            <div className="col-12 col-md-4">
              <h3 className="fw-bold mb-3">Schedule Your Hours</h3>
              <p className="text-secondary mb-0">
                Find good times for you with a simple search experience built
                around your availability and preferences.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="end-section py-5 text-center">
        <div className="container">
          <h2 className="fw-semibold mb-3">Ready to Get Started?</h2>

          <p className="text-secondary mb-4">
            Join thousands of volunteers making a difference in their communities.
          </p>

          <Link to="/search" className="btn btn-dark btn-lg px-4">
            Explore Opportunities
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Home;
