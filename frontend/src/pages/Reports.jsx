import { useEffect, useState } from "react";
import axios from "axios";
import {
  downloadPDF,
  downloadExcel,
  downloadCompliance,
} from "../services/reportService";
import {
  FiBarChart2,
  FiShield,
  FiCheckCircle,
  FiClock,
  FiHardDrive,
  FiFileText,
  FiDownload,
  FiActivity,
  FiTrendingUp,
} from "react-icons/fi";

import "./Reports.css";

function Reports() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
  try {
    const token = localStorage.getItem("token");

    console.log("Reports Token:", token);

    const res = await axios.get(
      "http://localhost:5000/api/devices",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setDevices(res.data || []);
  } catch (err) {
    console.error("REPORTS ERROR:", err.response?.data || err.message);
  } finally {
    setLoading(false);
  }
};

  const totalAssets = devices.length;

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
    totalAssets > 0
      ? Math.round(
          (completed / totalAssets) * 100
        )
      : 0;

  return (
    <div className="reports">

      {/* HERO */}

      <section className="reports-hero">

        <p className="hero-label">
          REPORTING & COMPLIANCE
        </p>

        <h1>
          TrustWipe Reporting Center
        </h1>

        <p>
          Monitor wipe operations,
          compliance readiness,
          certificate generation
          and enterprise audit data.
        </p>

      </section>

      {/* KPI */}

      <section className="stats-grid">

        <div className="stat-card">
          <FiHardDrive />
          <h2>{totalAssets}</h2>
          <span>Total Devices</span>
        </div>

        <div className="stat-card success">
          <FiCheckCircle />
          <h2>{completed}</h2>
          <span>Completed Wipes</span>
        </div>

        <div className="stat-card warning">
          <FiClock />
          <h2>{pending}</h2>
          <span>Pending Jobs</span>
        </div>

        <div className="stat-card info">
          <FiActivity />
          <h2>{wiping}</h2>
          <span>Running Jobs</span>
        </div>

      </section>

      {/* COMPLIANCE */}

      <section className="compliance-panel">

        <FiShield />

        <div>

          <h2>
            Compliance Status
          </h2>

          <p>
            NIST 800-88 • GDPR • ISO 27001
          </p>

        </div>

        <h1>100%</h1>

      </section>

      {/* ANALYTICS */}

      <section className="analytics-grid">

        <div className="panel">

          <div className="panel-header">
            <FiBarChart2 />
            Completion Rate
          </div>

          <div className="progress-track">

            <div
              className="progress-fill"
              style={{
                width:
                  `${completionRate}%`,
              }}
            />

          </div>

          <h3>
            {completionRate}%
          </h3>

        </div>

        <div className="panel">

          <div className="panel-header">
            <FiFileText />
            Certificates
          </div>

          <h1>{completed}</h1>

          <p>
            Generated Certificates
          </p>

        </div>

        <div className="panel">

          <div className="panel-header">
            <FiTrendingUp />
            Success Rate
          </div>

          <h1>
            {completionRate}%
          </h1>

          <p>
            Sanitization Success
          </p>

        </div>

      </section>

      {/* EXPORTS */}

      <section className="export-panel">

  <h2>Export Reports</h2>

  <div className="export-buttons">

    <button onClick={downloadPDF}>
      <FiDownload />
      PDF Report
    </button>

    <button onClick={downloadExcel}>
      <FiDownload />
      Excel Report
    </button>

    <button onClick={downloadCompliance}>
      <FiDownload />
      Compliance Report
    </button>

  </div>

</section>

      {/* RECENT ACTIVITY */}

      <section className="panel">

        <div className="panel-title">
          Recent Activity
        </div>

        <div className="activity-list">

          {devices
            .slice(0, 5)
            .map((device) => (

              <div
                className="activity-item"
                key={device._id}
              >

                <FiCheckCircle />

                <span>
                  {device.deviceName}
                  {" "}
                  -
                  {" "}
                  {device.status}
                </span>

              </div>

          ))}

        </div>

      </section>

      {/* TABLE */}

      <section className="panel">

        <div className="panel-title">
          Asset Compliance Report
        </div>

        <div className="table-wrapper">

          <table>

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

                  <td>
                    {device.deviceName}
                  </td>

                  <td>
                    {device.serialNumber}
                  </td>

                  <td>
                    {device.storageType}
                  </td>

                  <td>

                    <span
                      className={`badge ${device.status.toLowerCase()}`}
                    >
                      {device.status}
                    </span>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </section>

    </div>
  );
}

export default Reports;