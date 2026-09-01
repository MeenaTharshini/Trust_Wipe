
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FiShield,
  FiHardDrive,
  FiCheckCircle,
  FiActivity,
  FiSearch,
  FiCpu,
  FiMapPin,
} from "react-icons/fi";

import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [devices, setDevices] = useState([]);
  const [wipeJobs, setWipeJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  /*
   * =========================================================
   * LOAD DASHBOARD DATA
   * =========================================================
   */

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      /*
       * Get devices
       */
      const devicesResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/devices`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (devicesResponse.ok) {
        const devicesData = await devicesResponse.json();

        if (Array.isArray(devicesData)) {
          setDevices(devicesData);
        } else if (Array.isArray(devicesData.devices)) {
          setDevices(devicesData.devices);
        } else {
          setDevices([]);
        }
      }

      /*
       * Get wipe jobs
       */
      const jobsResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/wipe`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (jobsResponse.ok) {
        const jobsData = await jobsResponse.json();

        if (Array.isArray(jobsData)) {
          setWipeJobs(jobsData);
        } else if (Array.isArray(jobsData.jobs)) {
          setWipeJobs(jobsData.jobs);
        } else {
          setWipeJobs([]);
        }
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  /*
   * =========================================================
   * NAVIGATION HANDLERS
   * =========================================================
   */

  const handleAddDevice = () => {
    navigate("/devices");
  };

  const handlePathVerification = () => {
    navigate("/path-verification");
  };

  const handleVerification = () => {
    navigate("/verification");
  };

  const handleCertificates = () => {
    navigate("/certificates");
  };

  const handleReports = () => {
    navigate("/reports");
  };

  /*
   * =========================================================
   * SEARCH
   * =========================================================
   */

  const filteredDevices = devices.filter((device) => {
    const search = searchTerm.toLowerCase();

    return (
      device?.name?.toLowerCase().includes(search) ||
      device?.hostname?.toLowerCase().includes(search) ||
      device?.deviceName?.toLowerCase().includes(search) ||
      device?.serialNumber?.toLowerCase().includes(search) ||
      device?._id?.toLowerCase().includes(search)
    );
  });

  /*
   * =========================================================
   * STATISTICS
   * =========================================================
   */

  const totalDevices = devices.length;

  const onlineDevices = devices.filter(
    (device) =>
      device?.status === "online" ||
      device?.online === true ||
      device?.isOnline === true
  ).length;

  const completedJobs = wipeJobs.filter(
    (job) =>
      job?.status === "completed" ||
      job?.status === "success"
  ).length;

  const activeJobs = wipeJobs.filter(
    (job) =>
      job?.status === "running" ||
      job?.status === "in-progress" ||
      job?.status === "pending"
  ).length;

  /*
   * =========================================================
   * FORMAT DATE
   * =========================================================
   */

  const formatDate = (date) => {
    if (!date) return "—";

    try {
      return new Date(date).toLocaleString();
    } catch {
      return "—";
    }
  };

  /*
   * =========================================================
   * STATUS CLASS
   * =========================================================
   */

  const getStatusClass = (status) => {
    if (!status) return "unknown";

    return status
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "-");
  };

  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <div className="dashboard">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="dashboard-header">

        <div>
          <h1>Dashboard</h1>

          <p>
            Monitor devices, secure data wiping, and verification
            activity from one place.
          </p>
        </div>

      </div>


      {/* =====================================================
          STATISTICS
      ===================================================== */}

      <div className="stats-grid">

        {/* TOTAL DEVICES */}
        <div className="stat-card">

          <div className="stat-icon">
            <FiHardDrive />
          </div>

          <div className="stat-content">
            <span className="stat-label">
              Total Devices
            </span>

            <strong>
              {loading ? "..." : totalDevices}
            </strong>
          </div>

        </div>


        {/* ONLINE DEVICES */}
        <div className="stat-card">

          <div className="stat-icon">
            <FiCpu />
          </div>

          <div className="stat-content">
            <span className="stat-label">
              Online Devices
            </span>

            <strong>
              {loading ? "..." : onlineDevices}
            </strong>
          </div>

        </div>


        {/* COMPLETED WIPES */}
        <div className="stat-card">

          <div className="stat-icon">
            <FiCheckCircle />
          </div>

          <div className="stat-content">
            <span className="stat-label">
              Completed Wipes
            </span>

            <strong>
              {loading ? "..." : completedJobs}
            </strong>
          </div>

        </div>


        {/* ACTIVE JOBS */}
        <div className="stat-card">

          <div className="stat-icon">
            <FiActivity />
          </div>

          <div className="stat-content">
            <span className="stat-label">
              Active Jobs
            </span>

            <strong>
              {loading ? "..." : activeJobs}
            </strong>
          </div>

        </div>

      </div>


      {/* =====================================================
          DEVICE INVENTORY HEADER
      ===================================================== */}

      <div className="dashboard-section">

        <div className="section-header">

          <div>
            <h2>Device Inventory</h2>

            <p>
              Manage connected devices and perform secure
              verification operations.
            </p>
          </div>


          {/* =================================================
              ACTION BUTTONS
          ================================================= */}

          <div className="dashboard-actions">

            {/* SEARCH */}

            <div className="search-box">

              <FiSearch />

              <input
                type="text"
                placeholder="Search devices..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
              />

            </div>


            {/* ADD DEVICE */}

            <button
              className="add-btn"
              onClick={handleAddDevice}
              type="button"
            >
              + Add Device
            </button>


            {/* PATH VERIFICATION */}

            <button
              className="path-verification-btn"
              onClick={handlePathVerification}
              type="button"
              title="Verify a file or folder path"
            >
              <FiMapPin />
              Verify Path
            </button>

          </div>

        </div>


        {/* =================================================
            DEVICE TABLE
        ================================================= */}

        <div className="table-container">

          <table className="devices-table">

            <thead>
              <tr>
                <th>Device</th>
                <th>Hostname</th>
                <th>Status</th>
                <th>Last Seen</th>
              </tr>
            </thead>

            <tbody>

              {loading ? (

                <tr>
                  <td
                    colSpan="4"
                    className="empty-state"
                  >
                    Loading devices...
                  </td>
                </tr>

              ) : filteredDevices.length === 0 ? (

                <tr>
                  <td
                    colSpan="4"
                    className="empty-state"
                  >
                    {searchTerm
                      ? "No devices match your search."
                      : "No devices registered yet."}
                  </td>
                </tr>

              ) : (

                filteredDevices.map((device) => (

                  <tr
                    key={
                      device?._id ||
                      device?.id ||
                      device?.serialNumber
                    }
                  >

                    <td>

                      <div className="device-name">

                        <FiHardDrive />

                        <span>
                          {
                            device?.name ||
                            device?.deviceName ||
                            "Unknown Device"
                          }
                        </span>

                      </div>

                    </td>


                    <td>
                      {device?.hostname || "—"}
                    </td>


                    <td>

                      <span
                        className={`status-badge ${getStatusClass(
                          device?.status
                        )}`}
                      >
                        {device?.status || "Unknown"}
                      </span>

                    </td>


                    <td>
                      {
                        formatDate(
                          device?.lastSeen ||
                          device?.updatedAt ||
                          device?.createdAt
                        )
                      }
                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* =====================================================
          QUICK ACTIONS
      ===================================================== */}

      <div className="dashboard-section">

        <div className="section-header">

          <div>
            <h2>Quick Actions</h2>

            <p>
              Access frequently used TrustWipe operations.
            </p>
          </div>

        </div>


        <div className="quick-actions">

          {/* VERIFICATION */}

          <button
            type="button"
            className="quick-action-card"
            onClick={handleVerification}
          >

            <FiShield />

            <div>
              <h3>Verification</h3>

              <p>
                Verify secure wiping results.
              </p>
            </div>

          </button>


          {/* CERTIFICATES */}

          <button
            type="button"
            className="quick-action-card"
            onClick={handleCertificates}
          >

            <FiCheckCircle />

            <div>
              <h3>Certificates</h3>

              <p>
                View and manage wipe certificates.
              </p>
            </div>

          </button>


          {/* REPORTS */}

          <button
            type="button"
            className="quick-action-card"
            onClick={handleReports}
          >

            <FiActivity />

            <div>
              <h3>Reports</h3>

              <p>
                Generate compliance reports.
              </p>
            </div>

          </button>


          {/* PATH VERIFICATION */}

          <button
            type="button"
            className="quick-action-card"
            onClick={handlePathVerification}
          >

            <FiMapPin />

            <div>
              <h3>Path Verification</h3>

              <p>
                Verify files and folders before secure wiping.
              </p>
            </div>

          </button>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;