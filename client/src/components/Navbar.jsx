import { NavLink } from "react-router-dom";

function Navbar() {
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
            <NavLink to="/search" className={navbarClasses}>Search</NavLink>
            <NavLink to="/map" className={navbarClasses}>Map</NavLink>
            <NavLink to="/account" className={navbarClasses}>Account</NavLink>
          </div>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;