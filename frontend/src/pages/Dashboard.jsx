
import { useEffect, useState } from "react";
import axios from "axios";
import socket from "../services/socket";
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
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [showAgentPrompt, setShowAgentPrompt] = useState(false);
  const [showRunGuide, setShowRunGuide] = useState(false);
  const [latestJob, setLatestJob] = useState(null);

  // ----------------------------
  // FETCH DEVICES
  // ----------------------------
  const fetchDevices = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "https://trust-wipe.onrender.com/api/devices",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDevices(res.data);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  // ----------------------------
  // FETCH LATEST JOB
  // ----------------------------
  const fetchLatestJob = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "https://trust-wipe.onrender.com/api/wipe/latest",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setJobs(res.data.job ? [res.data.job] : []);
      setLatestJob(res.data.job || null);
    } catch (err) {
      console.error(
        "JOB ERROR:",
        err.response?.data || err.message
      );
    }
  };

  // ----------------------------
  // LOAD ALL DATA
  // ----------------------------
  const loadData = async () => {
    setLoading(true);

    await Promise.all([
      fetchDevices(),
      fetchLatestJob(),
    ]);

    setLoading(false);
  };

  // ----------------------------
  // INITIAL LOAD + POLLING
  // ----------------------------
  useEffect(() => {
    loadData();

    const interval = setInterval(loadData, 10000);

    return () => clearInterval(interval);
  }, []);

  // ----------------------------
  // SOCKET HANDLING
  // ----------------------------
  useEffect(() => {
    setConnected(socket.connected);

    const onConnect = () => {
      setConnected(true);
    };

    const onDisconnect = () => {
      setConnected(false);
    };

    const onWipeProgress = (job) => {
      setLatestJob(job);

      setJobs((prev) => {
        const index = prev.findIndex(
          (j) => j._id === job._id
        );

        if (index === -1) {
          return [job, ...prev];
        }

        const updated = [...prev];
        updated[index] = job;

        return updated;
      });
    };

    const onDeviceUpdated = () => {
      fetchDevices();
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("wipe-progress", onWipeProgress);
    socket.on("device-updated", onDeviceUpdated);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("wipe-progress", onWipeProgress);
      socket.off("device-updated", onDeviceUpdated);
    };
  }, []);

  // ----------------------------
  // ADD DEVICE
  // ----------------------------
  const handleAddDevice = () => {
    setShowAgentPrompt(true);
  };

  // ----------------------------
  // PATH VERIFICATION
  // ----------------------------
  const handlePathVerification = () => {
    navigate("/path-verification");
  };

  // ----------------------------
  // DOWNLOAD AGENT
  // ----------------------------
  const downloadAgent = () => {
    window.open(
      "https://trust-wipe.onrender.com/downloads/TrustWipeAgent.exe",
      "_blank"
    );

    setShowAgentPrompt(false);
    setShowRunGuide(true);
  };

  // ----------------------------
  // START WIPE
  // ----------------------------
  const startWipe = async (deviceId) => {
    try {
      const token = localStorage.getItem("token");

      console.log("POST Token:", token);

      const res = await axios.post(
        "https://trust-wipe.onrender.com/api/wipe/start",
        { deviceId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setJobs((prev) => [res.data, ...prev]);

      fetchDevices();
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  // ----------------------------
  // FILTER DEVICES
  // ----------------------------
  const filteredDevices = devices.filter(
    (device) =>
      device.deviceName
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      device.serialNumber
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  // ----------------------------
  // DASHBOARD STATS
  // ----------------------------
  const totalDevices = devices.length;

  const completedDevices = devices.filter(
    (device) => device.status === "Completed"
  ).length;

  const activeJobs = jobs.filter(
    (job) =>
      job.status === "running" ||
      job.status === "pending"
  );

  // ----------------------------
  // RENDER
  // ----------------------------
  return (
    <div className="dashboard">

      {/* =========================
          HEADER
      ========================== */}
      <section className="hero-section">

        <div className="hero-content">
          <p className="hero-label">
            SECURITY OPERATIONS CENTER
          </p>

          <h1>
            TrustWipe Enterprise Console
          </h1>

          <p>
            Secure Data Sanitization, Verification & Compliance Platform
          </p>
        </div>

        <div className="trust-card">
          <FiShield size={50} />

          <h2>
            {connected ? "ONLINE" : "OFFLINE"}
          </h2>

          <span>
            Socket Status
          </span>
        </div>

      </section>

      {/* =========================
          STATS
      ========================== */}
      <section className="stats-grid">

        <div className="stat-card">
          <FiHardDrive />

          <div>
            <span>Total Assets</span>
            <h2>{totalDevices}</h2>
          </div>
        </div>

        <div className="stat-card active">
          <FiActivity />

          <div>
            <span>Active Wipes</span>
            <h2>{activeJobs.length}</h2>
          </div>
        </div>

        <div className="stat-card success">
          <FiCheckCircle />

          <div>
            <span>Completed</span>
            <h2>{completedDevices}</h2>
          </div>
        </div>

        <div className="stat-card compliance">
          <FiShield />

          <div>
            <span>Compliance</span>
            <h2>100%</h2>
          </div>
        </div>

      </section>

      {/* =========================
          MAIN DASHBOARD
      ========================== */}
      <div className="dashboard-grid">

        {/* =========================
            DEVICE INVENTORY
        ========================== */}
        <section className="panel inventory-panel">

          <div className="panel-header">

            <h2>
              Device Inventory
            </h2>

            <div className="search-box">

              <FiSearch />

              <input
                value={search}
                placeholder="Search..."
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>

            {/* ACTION BUTTONS */}
            <div className="dashboard-actions">

              {/* ADD DEVICE */}
              <button
                className="add-btn"
                onClick={handleAddDevice}
              >
                + Add Device
              </button>

              {/* PATH VERIFICATION */}
              <button
                className="path-verification-btn"
                onClick={handlePathVerification}
              >
                <FiMapPin />
                Path Verification
              </button>

            </div>

          </div>

          {/* DEVICE TABLE */}

          {loading ? (

            <div className="empty">
              Loading Devices...
            </div>

          ) : (

            <div className="table-wrapper">

              <table>

                <thead>
                  <tr>
                    <th>Device</th>
                    <th>Serial</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredDevices.length === 0 ? (

                    <tr>
                      <td
                        colSpan="4"
                        className="empty"
                      >
                        No devices found.
                      </td>
                    </tr>

                  ) : (

                    filteredDevices.map((device) => (

                      <tr key={device._id}>

                        <td>
                          <FiCpu />{" "}
                          {device.deviceName}
                        </td>

                        <td>
                          {device.serialNumber}
                        </td>

                        <td>

                          <span
                            className={`badge ${device.status?.toLowerCase()}`}
                          >
                            {device.status}
                          </span>

                        </td>

                        <td>

                          {/* START WIPE */}

                          {device.status === "Pending" && (

                            <button
                              className="wipe-btn"
                              onClick={() =>
                                startWipe(
                                  device._id,
                                  device.deviceName
                                )
                              }
                            >
                              Start Wipe
                            </button>

                          )}

                          {/* VERIFY */}

                          {device.status === "Completed" && (

                            <button
                              className="verify-btn"
                              onClick={() =>
                                navigate(
                                  `/verification?jobId=${device.lastJobId}`
                                )
                              }
                            >
                              Verify
                            </button>

                          )}

                        </td>

                      </tr>

                    ))

                  )}

                </tbody>

              </table>

            </div>

          )}

        </section>

        {/* =========================
            LIVE OPERATIONS
        ========================== */}

        <section className="side-column">

          <div className="panel">

            <h2>
              Live Operations
            </h2>

            {!latestJob ? (

              <div className="empty">
                No Active Jobs
              </div>

            ) : (

              <div
                className="job-card"
                key={latestJob._id}
              >

                <div className="job-top">

                  <span>
                    Job #{latestJob._id}
                  </span>

                  <span>
                    {latestJob.progress}%
                  </span>

                </div>

                <div className="progress-track">

                  <div
                    className="progress-fill"
                    style={{
                      width: `${latestJob.progress}%`,
                    }}
                  />

                </div>

              </div>

            )}

          </div>

        </section>

      </div>

      {/* =========================
          AGENT REQUIRED MODAL
      ========================== */}

      {showAgentPrompt && (

        <div className="agent-modal-overlay">

          <div className="agent-modal">

            <h2>
              TrustWipe Agent Required
            </h2>

            <p>
              Before discovering devices, the
              TrustWipe Agent must be installed
              on this computer.
            </p>

            <div className="agent-features">

              <div>
                ✔ Detects internal & external drives
              </div>

              <div>
                ✔ Performs certified data wiping
              </div>

              <div>
                ✔ Streams live wipe progress
              </div>

              <div>
                ✔ Generates verification evidence
              </div>

            </div>

            <div className="agent-actions">

              <button
                className="download-btn"
                onClick={downloadAgent}
              >
                Download Agent
              </button>

              <button
                className="already-btn"
                onClick={() => {
                  setShowAgentPrompt(false);
                  setShowRunGuide(true);
                }}
              >
                Already Downloaded
              </button>

              <button
                className="cancel-btn"
                onClick={() =>
                  setShowAgentPrompt(false)
                }
              >
                Cancel
              </button>

            </div>

            <div className="agent-note">

              After installation, launch the
              TrustWipe Agent.

              Once it connects, click{" "}
              <strong>Add Device</strong> again.

            </div>

          </div>

        </div>

      )}

      {/* =========================
          RUN AGENT GUIDE MODAL
      ========================== */}

      {showRunGuide && (

        <div className="agent-modal-overlay">

          <div className="agent-modal">

            <h2>
              Run TrustWipe Agent
            </h2>

            <p>
              If you have already downloaded the
              TrustWipe Agent, please make sure
              it is running before continuing.
            </p>

            <div className="agent-features">

              <div>
                1. Locate{" "}
                <b>TrustWipeAgent.exe</b>.
              </div>

              <div>
                2. Right-click and choose{" "}
                <b>Run as Administrator</b>.
              </div>

              <div>
                3. If Windows SmartScreen appears,
                click{" "}
                <b>
                  More Info → Run Anyway
                </b>.
              </div>

              <div>
                4. Wait until the console shows:
              </div>

            </div>

            <div
              style={{
                background: "#111",
                color: "#0f0",
                padding: "15px",
                borderRadius: "8px",
                margin: "18px 0",
                fontFamily: "monospace",
                textAlign: "left",
              }}
            >
              🟢 Connected to TrustWipe Server
              <br />
              📡 Agent registration sent
              <br />
            </div>

            <p>
              Once these messages appear,
              click <b>Continue</b>.
            </p>

            <div className="agent-actions">

              <button
                className="download-btn"
                onClick={() => {

                  if (connected) {

                    setShowRunGuide(false);

                    navigate("/devices");

                  } else {

                    alert(
                      "Please start the TrustWipe Agent first."
                    );

                  }

                }}
              >
                Continue
              </button>

              <button
                className="cancel-btn"
                onClick={() =>
                  setShowRunGuide(false)
                }
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Dashboard;