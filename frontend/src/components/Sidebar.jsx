import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Database,
  ShieldCheck,
  FileText,
  BarChart3,
  Menu,
  X,
} from "lucide-react";

import "./Sidebar.css";

function Sidebar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const menus = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Devices", path: "/devices", icon: Database },
    { name: "Verification", path: "/verification", icon: ShieldCheck },
    { name: "Verify Certificate", path: "/verify-certificate", icon: FileText },
    { name: "Reports", path: "/reports", icon: BarChart3 },

  ];

  return (
    <>
      {/* TOGGLE (mobile only) */}
      <button
        className={`menu-toggle ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* OVERLAY */}
      {isOpen && (
        <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />
      )}

      {/* SIDEBAR */}
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>

        {/* BRAND */}
        <div className="sidebar-brand">
          <div className="logo">
            <ShieldCheck size={22} />
          </div>

          <div>
            <h2>TrustWipe</h2>
            <p>SOC Console</p>
          </div>
        </div>

        {/* NAV */}
        <nav className="sidebar-nav">
          {menus.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`sidebar-link ${
                  location.pathname === item.path ? "active" : ""
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

          <div className="card">
            <div className="row">
              <span>Compliance</span>
              <span className="dot" />
            </div>

            <h4>NIST 800-88</h4>

            <div className="bar">
              <div />
            </div>

            <small>Certified Security Standard</small>
          </div>

          <div className="card">
            <span>Security Score</span>
            <h2>99.8%</h2>
          </div>

        </div>
      </aside>
    </>
  );
}

export default Sidebar;