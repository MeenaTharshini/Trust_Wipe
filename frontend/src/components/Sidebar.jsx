import { useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  LayoutDashboard,
  Database,
  ShieldCheck,
  FileText,
  BarChart3,
  Radar,
  X,
  Shield,
  LogOut,
  User,
} from "lucide-react";

import "./Sidebar.css";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const menus = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Reports",
      path: "/reports",
      icon: BarChart3,
    },
  ];

  return (
    <>
      {/* MOBILE TOGGLE */}
      <button
        className={`sidebar-toggle ${open ? "active" : ""}`}
        onClick={() => setOpen(!open)}
      >
        {open ? (
          <X size={22} />
        ) : (
          <Radar size={22} />
        )}
      </button>

      {/* OVERLAY */}
      {open && (
        <div
          className="sidebar-overlay"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`sidebar ${
          open ? "show" : ""
        }`}
      >
        {/* LOGO */}
        <div className="sidebar-brand">
          <div className="brand-icon">
            <Shield size={24} />
          </div>

          <div>
            <h2>TrustWipe</h2>
            <span>SOC Console</span>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="sidebar-nav">
          {menus.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={`nav-link ${
                  location.pathname ===
                  item.path
                    ? "active"
                    : ""
                }`}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* FOOTER */}
        <div className="sidebar-footer">

          {/* COMPLIANCE CARD */}
          <div className="footer-card">
            <div className="footer-top">
              <span>Compliance</span>
              <div className="status-dot" />
            </div>

            <h4>NIST 800-88</h4>

            <div className="progress">
              <div className="progress-fill" />
            </div>

            <small>
              Certified Security Standard
            </small>
          </div>

          {/* USER CARD */}
          <div className="user-panel">
            <div className="user-info">
              <div className="user-avatar">
                <User size={18} />
              </div>

              <div className="user-details">
                <h4>
                  {user.name ||
                    user.username ||
                    "User"}
                </h4>

                <small>
                  {user.email ||
                    "No Email"}
                </small>
              </div>
            </div>

            <button
              className="logout-btn"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>

        </div>
      </aside>
    </>
  );
}

export default Sidebar;