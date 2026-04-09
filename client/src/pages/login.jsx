import { useState } from "react";

function Login() {
  const [isSignup, setIsSignup] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    accountType: "",
    phone: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    accountType: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      accountType: "",
    };

    if (isSignup && !formData.firstName.trim()) {
      newErrors.firstName = "Please enter your first name.";
    }

    if (isSignup && !formData.lastName.trim()) {
      newErrors.lastName = "Please enter your last name.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email.";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Please enter your password.";
    }

    if (isSignup && !formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password.";
    }

    if (
      isSignup &&
      formData.password.trim() &&
      formData.confirmPassword.trim() &&
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (isSignup && !formData.accountType) {
      newErrors.accountType = "Please select an account type.";
    }

    const hasErrors = Object.values(newErrors).some((value) => value !== "");

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    setErrors({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      accountType: "",
    });

    console.log("Form submitted:", formData);
  };

  let subtext;

  if (isSignup) {
    subtext =
      "Sign up to find opportunities as a volunteer or manage your organization's events!";
  } else {
    subtext =
      "Log in to explore opportunities, track hours, or manage your organization's account.";
  }

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
              {isSignup ? "Create an Account" : "Welcome Back"}
            </h1>

            <p className="login-subtext text-secondary mb-2">{subtext}</p>
          </div>

          <div className="login-card-wrapper">
            <div className="login-card">
              <div className="login-toggle mb-4">
                <button
                  type="button"
                  className={`login-toggle-btn ${!isSignup ? "active" : ""}`}
                  onClick={() => {
                    setIsSignup(false);

                    setFormData({
                      firstName: "",
                      lastName: "",
                      email: "",
                      password: "",
                      confirmPassword: "",
                      accountType: "",
                      phone: "",
                    });

                    setErrors({
                      firstName: "",
                      lastName: "",
                      email: "",
                      password: "",
                      confirmPassword: "",
                      accountType: "",
                    });
                  }}
                >
                  Log In
                </button>

                <button
                  type="button"
                  className={`login-toggle-btn ${isSignup ? "active" : ""}`}
                  onClick={() => {
                    setIsSignup(true);

                    setFormData({
                      firstName: "",
                      lastName: "",
                      email: "",
                      password: "",
                      confirmPassword: "",
                      accountType: "",
                      phone: "",
                    });

                    setErrors({
                      firstName: "",
                      lastName: "",
                      email: "",
                      password: "",
                      confirmPassword: "",
                      accountType: "",
                    });
                  }}
                >
                  Sign Up
                </button>
              </div>

              <form className="login-form" onSubmit={handleSubmit} noValidate>
                {isSignup && (
                  <div className="row">
                    <div className="col-12 col-md-6">
                      <div className="mb-2">
                        <label htmlFor="firstName" className="form-label login-label">
                          First Name*
                        </label>
                        <input
                          id="firstName"
                          name="firstName"
                          type="text"
                          className={`form-control login-input ${
                            errors.firstName ? "input-error" : ""
                          }`}
                          placeholder="Enter your first name"
                          value={formData.firstName}
                          onChange={handleChange}
                          aria-invalid={errors.firstName ? "true" : "false"}
                          aria-describedby={
                            errors.firstName ? "firstName-error" : undefined
                          }
                        />
                        <div
                          id="firstName-error"
                          className="login-error-text"
                          aria-live="polite"
                        >
                          {errors.firstName}
                        </div>
                      </div>
                    </div>

                    <div className="col-12 col-md-6">
                      <div className="mb-2">
                        <label htmlFor="lastName" className="form-label login-label">
                          Last Name*
                        </label>
                        <input
                          id="lastName"
                          name="lastName"
                          type="text"
                          className={`form-control login-input ${
                            errors.lastName ? "input-error" : ""
                          }`}
                          placeholder="Enter your last name"
                          value={formData.lastName}
                          onChange={handleChange}
                          aria-invalid={errors.lastName ? "true" : "false"}
                          aria-describedby={
                            errors.lastName ? "lastName-error" : undefined
                          }
                        />
                        <div
                          id="lastName-error"
                          className="login-error-text"
                          aria-live="polite"
                        >
                          {errors.lastName}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mb-2">
                  <label htmlFor="email" className="form-label login-label">
                    Email{isSignup ? "*" : ""}
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className={`form-control login-input ${
                      errors.email ? "input-error" : ""
                    }`}
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    aria-invalid={errors.email ? "true" : "false"}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                  <div
                    id="email-error"
                    className="login-error-text"
                    aria-live="polite"
                  >
                    {errors.email}
                  </div>
                </div>

                {isSignup && (
                    <div className="mb-4">
                        <label htmlFor="phone" className="form-label login-label">
                        Phone (optional)
                        </label>
                        <input
                        id="phone"
                        name="phone"
                        type="tel"
                        className="form-control login-input"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={handleChange}
                        />
                    </div>
                )}

                <div className="mb-2">
                  <label htmlFor="password" className="form-label login-label">
                    Password{isSignup ? "*" : ""}
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    className={`form-control login-input ${
                      errors.password ? "input-error" : ""
                    }`}
                    placeholder={isSignup ? "Create a password" : "Enter your password"}
                    value={formData.password}
                    onChange={handleChange}
                    aria-invalid={errors.password ? "true" : "false"}
                    aria-describedby={errors.password ? "password-error" : undefined}
                  />
                  <div
                    id="password-error"
                    className="login-error-text"
                    aria-live="polite"
                  >
                    {errors.password}
                  </div>
                </div>

                {isSignup && (
                  <>
                    <div className="mb-2">
                      <label
                        htmlFor="confirmPassword"
                        className="form-label login-label"
                      >
                        Confirm Password*
                      </label>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        className={`form-control login-input ${
                          errors.confirmPassword ? "input-error" : ""
                        }`}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        aria-invalid={errors.confirmPassword ? "true" : "false"}
                        aria-describedby={
                          errors.confirmPassword
                            ? "confirmPassword-error"
                            : undefined
                        }
                      />
                      <div
                        id="confirmPassword-error"
                        className="login-error-text"
                        aria-live="polite"
                      >
                        {errors.confirmPassword}
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="accountType" className="form-label login-label">
                        Account Type*
                      </label>

                      <select
                        id="accountType"
                        name="accountType"
                        className={`form-select login-input ${
                          errors.accountType ? "input-error" : ""
                        }`}
                        value={formData.accountType}
                        onChange={handleChange}
                        aria-invalid={errors.accountType ? "true" : "false"}
                        aria-describedby={
                          errors.accountType ? "accountType-error" : undefined
                        }
                      >
                        <option value="">Select account type</option>
                        <option value="volunteer">Volunteer</option>
                        <option value="organization">Organization</option>
                      </select>

                      <div
                        id="accountType-error"
                        className="login-error-text"
                        aria-live="polite"
                      >
                        {errors.accountType}
                      </div>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  className="btn btn-dark btn-lg w-100 login-submit-btn"
                >
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
                  onClick={() => {
                    setIsSignup(!isSignup);

                    setFormData({
                      firstName: "",
                      lastName: "",
                      email: "",
                      password: "",
                      confirmPassword: "",
                      accountType: "",
                      phone: "",
                    });

                    setErrors({
                      firstName: "",
                      lastName: "",
                      email: "",
                      password: "",
                      confirmPassword: "",
                      accountType: "",
                    });
                  }}
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