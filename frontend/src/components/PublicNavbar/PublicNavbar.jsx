import { Link } from "react-router-dom";
import { FiShield } from "react-icons/fi";

import "./PublicNavbar.css";

function PublicNavbar() {
  return (
    <header className="public-navbar">

      <Link
        to="/"
        className="public-logo"
      >
        <FiShield />
        <span>TrustWipe</span>
      </Link>

      <nav className="public-nav-links">

        <Link to="/services">
  Services
</Link>

<Link to="/about">
  About
</Link>

<Link to="/verify">
  Verify
</Link>

      </nav>

      <div className="public-nav-actions">

        <Link
          to="/login"
          className="nav-login-btn"
        >
          Login
        </Link>

        <Link
          to="/register"
          className="nav-register-btn"
        >
          Register
        </Link>

      </div>

    </header>
  );
}

export default PublicNavbar;