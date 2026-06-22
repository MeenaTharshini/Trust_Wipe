import { useEffect, useState } from "react";
import axios from "axios";
import "./Reports.css";

function Reports() {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/devices"
      );

      setDevices(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const total = devices.length;

  const completed = devices.filter(
    (d) => d.status === "Completed"
  ).length;

  const pending = devices.filter(
    (d) => d.status === "Pending"
  ).length;

  const wiping = devices.filter(
    (d) => d.status === "Wiping"
  ).length;

  const completionRate =
    total > 0
      ? Math.round((completed / total) * 100)
      : 0;

  return (
    <div className="reports-page">

      {/* HERO */}

      <div className="reports-hero">

        <div>
          <p className="hero-label">
            TRUSTWIPE ANALYTICS
          </p>

          <h1>Reports & Compliance</h1>

          <p className="hero-subtitle">
            Enterprise-grade reporting and
            sanitization performance insights.
          </p>
        </div>

        <button className="export-btn">
          📄 Export Report
        </button>

      </div>

      {/* KPI */}

      <div className="reports-kpi-grid">

        <div className="report-card">
          <span>Total Assets</span>
          <h2>{total}</h2>
        </div>

        <div className="report-card success">
          <span>Completed Wipes</span>
          <h2>{completed}</h2>
        </div>

        <div className="report-card warning">
          <span>Pending</span>
          <h2>{pending}</h2>
        </div>

        <div className="report-card info">
          <span>Running Jobs</span>
          <h2>{wiping}</h2>
        </div>

      </div>

      {/* COMPLIANCE */}

      <div className="compliance-panel">

        <div>
          <p>Compliance Score</p>
          <h2>99.8%</h2>
          <span>NIST 800-88 Certified</span>
        </div>

        <div className="shield">
          🛡️
        </div>

      </div>

      {/* COMPLETION */}

      <div className="analytics-card">

        <div className="section-header">
          <h2>Wipe Completion Rate</h2>
          <span>{completionRate}%</span>
        </div>

        <div className="progress-track">

          <div
            className="progress-fill"
            style={{
              width: `${completionRate}%`,
            }}
          />

        </div>

      </div>

      {/* INSIGHTS */}

      <div className="insights-grid">

        <div className="analytics-card">
          <h3>Success Rate</h3>
          <h1>99.8%</h1>
        </div>

        <div className="analytics-card">
          <h3>Devices Processed</h3>
          <h1>{completed}</h1>
        </div>

        <div className="analytics-card">
          <h3>Awaiting Action</h3>
          <h1>{pending}</h1>
        </div>

      </div>

      {/* TABLE */}

      <div className="analytics-card">

        <div className="section-header">
          <h2>Asset Report</h2>
          <span>{total} Assets</span>
        </div>

        <div className="table-wrapper">

          <table className="report-table">

            <thead>
              <tr>
                <th>Device</th>
                <th>Serial</th>
                <th>Storage</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>

              {devices.map((device) => (

                <tr key={device._id}>

                  <td>{device.deviceName}</td>

                  <td>{device.serialNumber}</td>

                  <td>{device.storageType}</td>

                  <td>

                    <span
                      className={`status-badge ${
                        device.status === "Completed"
                          ? "completed"
                          : device.status === "Wiping"
                          ? "running"
                          : "pending"
                      }`}
                    >
                      {device.status}
                    </span>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default Reports;