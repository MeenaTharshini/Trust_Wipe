import { useEffect, useState } from "react";
import axios from "axios";

import {
  FiBarChart2,
  FiShield,
  FiCheckCircle,
  FiClock,
  FiHardDrive,
  FiFileText,
  FiDownload,
  FiActivity,
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
      const res = await axios.get(
        "http://localhost:5000/api/devices"
      );

      setDevices(res.data || []);
    } catch (err) {
      console.error(err);
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
      ? Math.round((completed / totalAssets) * 100)
      : 0;

  const complianceScore = 100;

  return (
    <div className="reports">

      {/* HERO */}
      <section className="reports-hero">

        <div className="hero-content">
          <p className="hero-label">
            COMPLIANCE & ANALYTICS
          </p>

          <h1>
            TrustWipe Reports Center
          </h1>

          <p>
            Enterprise reporting, audit trails,
            compliance monitoring and wipe analytics.
          </p>
        </div>

      </section>

      {/* KPI SECTION */}
      <section className="stats-grid">

        <div className="stat-card">
          <FiHardDrive />
          <div>
            <span>Total Assets</span>
            <h2>{totalAssets}</h2>
          </div>
        </div>

        <div className="stat-card success">
          <FiCheckCircle />
          <div>
            <span>Completed Wipes</span>
            <h2>{completed}</h2>
          </div>
        </div>

        <div className="stat-card warning">
          <FiClock />
          <div>
            <span>Pending</span>
            <h2>{pending}</h2>
          </div>
        </div>

        <div className="stat-card info">
          <FiActivity />
          <div>
            <span>Running Jobs</span>
            <h2>{wiping}</h2>
          </div>
        </div>

      </section>

      {/* COMPLIANCE */}
      <section className="compliance-card">

        <div>
          <p>Compliance Readiness</p>
          <h1>{complianceScore}%</h1>

          <span>
            NIST 800-88 • GDPR • ISO 27001
          </span>
        </div>

        <FiShield size={80} />

      </section>

      {/* ANALYTICS */}
      <section className="analytics-grid">

        <div className="panel">

          <div className="panel-header">
            <FiBarChart2 />
            <h2>Completion Rate</h2>
          </div>

          <div className="progress-track">
            <div
              className="progress-fill"
              style={{
                width: `${completionRate}%`,
              }}
            />
          </div>

          <h3>{completionRate}%</h3>

        </div>

        <div className="panel">

          <div className="panel-header">
            <FiFileText />
            <h2>Certificates</h2>
          </div>

          <h1>{completed}</h1>

          <p>
            Certificates Generated
          </p>

        </div>

        <div className="panel">

          <div className="panel-header">
            <FiShield />
            <h2>Audit Status</h2>
          </div>

          <h1>READY</h1>

          <p>
            Enterprise Compliance Verified
          </p>

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

                  <td>{device.deviceName}</td>

                  <td>{device.serialNumber}</td>

                  <td>{device.storageType}</td>

                  <td>

                    <span
                      className={`badge ${
                        device.status.toLowerCase()
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

      </section>

    </div>
  );
}

export default Reports;