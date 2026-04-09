import { useState } from "react";

function Login() {
  const [isSignup, setIsSignup] = useState(false);

  return (
    <main className="login-page">
      <nav className="navbar bg-white border-bottom">
        <div className="container d-flex justify-content-center">
            <span className="navbar-brand navbar-name fw-bold m-0">
            KindBridge
            </span>
        </div>
      </nav>

      <section className="login-section py-5">
        <div className="container">
          <div className="login-header text-center mb-5">
            <h1 className="fw-bold mb-3">
              {isSignup ? "Create Your Account" : "Welcome Back"}
            </h1>

            <p className="login-subtext text-secondary mb-0">
              {isSignup
                ? "Sign up to find opportunities as a volunteer or manage your organization's events!"
                : "Log in to explore opportunities, track hours, or manage your organization's account."}
            </p>
          </div>

          <div className="login-card-wrapper">
            <div className="login-card">
              <div className="login-toggle mb-4">
                <button
                  type="button"
                  className={`login-toggle-btn ${!isSignup ? "active" : ""}`}
                  onClick={() => setIsSignup(false)}
                >
                  Log In
                </button>

                <button
                  type="button"
                  className={`login-toggle-btn ${isSignup ? "active" : ""}`}
                  onClick={() => setIsSignup(true)}
                >
                  Sign Up
                </button>
              </div>

              <form className="login-form">
                {isSignup && (
                  <div className="row">
                    <div className="col-12 col-md-6">
                      <div className="mb-3">
                        <label className="form-label login-label">First Name</label>
                        <input
                          type="text"
                          className="form-control login-input"
                          placeholder="Enter your first name"
                        />
                      </div>
                    </div>

                    <div className="col-12 col-md-6">
                      <div className="mb-3">
                        <label className="form-label login-label">Last Name</label>
                        <input
                          type="text"
                          className="form-control login-input"
                          placeholder="Enter your last name"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label login-label">Email</label>
                  <input
                    type="email"
                    className="form-control login-input"
                    placeholder="Enter your email"
                  />
                </div>

                {isSignup && (
                  <div className="mb-3">
                    <label className="form-label login-label">Username</label>
                    <input
                      type="text"
                      className="form-control login-input"
                      placeholder="Choose a username"
                    />
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label login-label">Password</label>
                  <input
                    type="password"
                    className="form-control login-input"
                    placeholder={
                      isSignup ? "Create a password" : "Enter your password"
                    }
                  />
                </div>

                {isSignup && (
                  <>
                    <div className="mb-3">
                      <label className="form-label login-label">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        className="form-control login-input"
                        placeholder="Confirm your password"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label login-label">
                        Account Type
                      </label>
                      <select className="form-select login-input">
                        <option value="">Select account type</option>
                        <option value="volunteer">Volunteer</option>
                        <option value="organization">Organization</option>
                      </select>
                    </div>
                  </>
                )}

                <button type="submit" className="btn btn-dark btn-lg w-100 login-submit-btn">
                  {isSignup ? "Create Account" : "Log In"}
                </button>
              </form>

              <div className="text-center mt-4">
                <p className="text-secondary mb-2">
                  {isSignup
                    ? "Already have an account?"
                    : "Don’t have an account yet?"}
                </p>

                <button
                  type="button"
                  className="login-switch-btn"
                  onClick={() => setIsSignup(!isSignup)}
                >
                  {isSignup ? "Log In Instead" : "Sign Up Instead"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Login;