import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { token, login, signup } = useAuth();
  const [formError, setFormError] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    organizationName: "",
    email: "",
    password: "",
    confirmPassword: "",
    accountType: "volunteer",
    phone: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    organizationName: "",
    email: "",
    password: "",
    confirmPassword: "",
    accountType: "",
    phone: "",
  });

  const clearForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      organizationName: "",
      email: "",
      password: "",
      confirmPassword: "",
      accountType: "volunteer",
      phone: "",
    });

    setErrors({
      firstName: "",
      lastName: "",
      organizationName: "",
      email: "",
      password: "",
      confirmPassword: "",
      accountType: "",
      phone: "",
    });

    setFormError("");
  };

  useEffect(() => {
    if (token) {
      navigate("/account", { replace: true });
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    const updatedFormData = {
      ...formData,
      [name]: value,
    };

    if (name === "accountType") {
      if (value === "organization") {
        updatedFormData.firstName = "";
        updatedFormData.lastName = "";
      } else if (value === "volunteer") {
        updatedFormData.organizationName = "";
      }
    }

    setFormData(updatedFormData);

    setErrors({
      ...errors,
      [name]: "",
    });

    setFormError("");
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValidPhone = (input) => {
    const digits = String(input || "").replace(/\D/g, "");
    return digits.length >= 10 && digits.length <= 15;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      firstName: "",
      lastName: "",
      organizationName: "",
      email: "",
      password: "",
      confirmPassword: "",
      accountType: "",
      phone: "",
    };

    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email.";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email.";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Please enter your password.";
    }

    if (isSignup && !formData.accountType) {
      newErrors.accountType = "Please select an account type.";
    }

    if (isSignup && formData.accountType === "volunteer") {
      if (!formData.firstName.trim()) {
        newErrors.firstName = "Please enter your first name.";
      }

      if (!formData.lastName.trim()) {
        newErrors.lastName = "Please enter your last name.";
      }
    }

    if (isSignup && formData.accountType === "organization") {
      if (!formData.organizationName.trim()) {
        newErrors.organizationName = "Please enter your organization name.";
      }

      if (!formData.phone.trim()) {
        newErrors.phone = "Please enter your phone number.";
      } else if (!isValidPhone(formData.phone)) {
        newErrors.phone = "Please enter a valid phone number.";
      }
    }

    if (isSignup && formData.accountType === "volunteer" && formData.phone.trim()) {
      if (!isValidPhone(formData.phone)) {
        newErrors.phone = "Please enter a valid phone number.";
      }
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

    const hasErrors = Object.values(newErrors).some((value) => value !== "");

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    setErrors({
      firstName: "",
      lastName: "",
      organizationName: "",
      email: "",
      password: "",
      confirmPassword: "",
      accountType: "",
      phone: "",
    });

    try {
      setFormError("");
      if (isSignup) {
        await signup({
          accountType: formData.accountType,
          email: formData.email.trim(),
          password: formData.password,
          firstName: formData.accountType === "volunteer" ? formData.firstName.trim() : undefined,
          lastName: formData.accountType === "volunteer" ? formData.lastName.trim() : undefined,
          organizationName:
            formData.accountType === "organization" ? formData.organizationName.trim() : undefined,
          phone: formData.phone.trim() || undefined,
        });
      } else {
        await login({
          email: formData.email.trim(),
          password: formData.password,
        });
      }

      const from = location.state?.from;
      navigate(typeof from === "string" ? from : "/account", { replace: true });
    } catch (err) {
      setFormError(err?.message || "Something went wrong. Please try again.");
    }
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
                    clearForm();
                  }}
                >
                  Log In
                </button>

                <button
                  type="button"
                  className={`login-toggle-btn ${isSignup ? "active" : ""}`}
                  onClick={() => {
                    setIsSignup(true);
                    clearForm();
                  }}
                >
                  Sign Up
                </button>
              </div>

              <form className="login-form" onSubmit={handleSubmit} noValidate>
                {formError && (
                  <div className="alert alert-danger mb-3" role="alert">
                    {formError}
                  </div>
                )}
                {isSignup && (
                  <div className="mb-3">
                    <label className="form-label login-label">
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
                    >
                      <option value="volunteer">Volunteer</option>
                      <option value="organization">Organization</option>
                    </select>

                    <div id="accountType-error" className="login-error-text">
                      {errors.accountType}
                    </div>
                  </div>
                )}

                {isSignup && formData.accountType === "volunteer" && (
                  <div className="row">
                    <div className="col-12 col-md-6">
                      <div className="mb-2">
                        <label className="form-label login-label">
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
                        />
                        <div id="firstName-error" className="login-error-text">
                          {errors.firstName}
                        </div>
                      </div>
                    </div>

                    <div className="col-12 col-md-6">
                      <div className="mb-2">
                        <label className="form-label login-label">
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
                        />
                        <div id="lastName-error" className="login-error-text">
                          {errors.lastName}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {isSignup && formData.accountType === "organization" && (
                  <div className="mb-2">
                    <label className="form-label login-label">
                      Organization Name*
                    </label>
                    <input
                      id="organizationName"
                      name="organizationName"
                      type="text"
                      className={`form-control login-input ${
                        errors.organizationName ? "input-error" : ""
                      }`}
                      placeholder="Enter your organization name"
                      value={formData.organizationName}
                      onChange={handleChange}
                    />
                    <div id="organizationName-error" className="login-error-text">
                      {errors.organizationName}
                    </div>
                  </div>
                )}

                <div className="mb-2">
                  <label className="form-label login-label">
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
                  />
                  <div id="email-error" className="login-error-text">
                    {errors.email}
                  </div>
                </div>

                {isSignup && (
                  <div className="mb-4">
                    <label className="form-label login-label">
                      {formData.accountType === "organization"
                        ? "Phone*"
                        : "Phone (optional)"}
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      className={`form-control login-input ${
                        errors.phone ? "input-error" : ""
                      }`}
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                    <div id="phone-error" className="login-error-text">
                      {errors.phone}
                    </div>
                  </div>
                )}

                <div className="mb-2">
                  <label className="form-label login-label">
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
                  />
                  <div id="password-error" className="login-error-text">
                    {errors.password}
                  </div>
                </div>

                {isSignup && (
                  <div className="mb-2">
                    <label className="form-label login-label">
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
                    />
                    <div id="confirmPassword-error" className="login-error-text">
                      {errors.confirmPassword}
                    </div>
                  </div>
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
                  onClick={() => {
                    setIsSignup(!isSignup);
                    clearForm();
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