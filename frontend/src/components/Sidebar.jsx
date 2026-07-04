import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import {
  LayoutDashboard,
  Database,
  ShieldCheck,
  FileText,
  BarChart3,Radar,
  Menu,
  X,
  Shield,
} from "lucide-react";

import "./Sidebar.css";

function Sidebar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const menus = [
    {
      name: "Dashboard",
      path: "/",
      icon: LayoutDashboard,
    },
    {
      name: "Devices",
      path: "/devices",
      icon: Database,
    },
    {
      name: "Verification",
      path: "/verification",
      icon: ShieldCheck,
    },
    {
      name: "Verify Certificate",
      path: "/verify-certificate",
      icon: FileText,
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
        {open ? <X size={22} /> : <Radar size={22} />}
      </button>

      {/* OVERLAY */}
      {open && (
        <div
          className="sidebar-overlay"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`sidebar ${open ? "show" : ""}`}>

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
                  location.pathname === item.path
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

          <div className="footer-card">

            <div className="footer-top">
              <span>Compliance</span>
              <div className="status-dot" />
            </div>

            <h4>NIST 800-88</h4>

            <div className="progress">
              <div className="progress-fill" />
            </div>

            <small>Certified Security Standard</small>

          </div>

          <div className="footer-card">

            <span className="score-label">
              Security Score
            </span>

            <h1>99.8%</h1>

          </div>

        </div>
      </aside>
    </>
  );
}

export default Sidebar;