import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

function Navbar() {
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  const navbarClasses = ({ isActive }) =>
    isActive ? "nav-link active fw-semibold" : "nav-link";

  return (
    <nav className="navbar navbar-expand-md bg-white border-bottom">
      <div className="container">

        <NavLink className="navbar-brand navbar-name fw-bold" to="/">
          KindBridge
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#main-navbar"
          aria-controls="main-navbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="main-navbar">
          <div className="navbar-nav ms-auto">
            <NavLink to="/" className={navbarClasses}>Home</NavLink>
            <NavLink to="/map" className={navbarClasses}>Map</NavLink>
            {token && (
              <NavLink to="/account" className={navbarClasses}>Profile</NavLink>
            )}
            {token ? (
              <button
                type="button"
                className="nav-link btn btn-link p-0"
                onClick={() => {
                  logout();
                  navigate("/login", { replace: true });
                }}
              >
                Logout
              </button>
            ) : (
              <NavLink to="/login" className={navbarClasses}>Login</NavLink>
            )}
          </div>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;