import { useEffect, useState } from "react";
import axios from "axios";
import socket from "../services/socket";
import {Link, useNavigate } from "react-router-dom";

import {
  FiShield,
  FiHardDrive,
  FiCheckCircle,
  FiActivity,
  FiSearch,
  FiCpu,
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
    console.log(err.response?.data);
  }
};

  // ----------------------------
  // FETCH JOBS
  // ----------------------------
  const fetchJobs = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      "https://trust-wipe.onrender.com/api/wipe",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setJobs(res.data.jobs || []);
  } catch (err) {
    console.error("JOB ERROR:", err.response?.data || err.message);
  }
};
  // ----------------------------
  // LOAD ALL DATA
  // ----------------------------
  const loadData = async () => {
    setLoading(true);
    await Promise.all([fetchDevices(), fetchJobs()]);
    setLoading(false);
  };

  // initial load + polling
  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  // ----------------------------
  // SOCKET HANDLING (FIXED)
  // ----------------------------
  useEffect(() => {
    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);

    const onWipeProgress = (job) => {
  setJobs((prev) => {
    const index = prev.findIndex((j) => j._id === job._id);

    if (index === -1) return [job, ...prev];

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
  const handleAddDevice = () => {
  // If agent is already connected, go directly
  if (connected) {
    navigate("/devices");
    return;
  }

  // Otherwise show install dialog
  setShowAgentPrompt(true);
};
  const downloadAgent = () => {
  window.open(
    "https://trust-wipe.onrender.com/downloads/TrustWipeAgentSetup.exe",
    "_blank"
  );
};
  // ----------------------------
  // START WIPE
  // ----------------------------
  const startWipe = async (deviceId) => {
  try {
    const token = localStorage.getItem("token");

    console.log("POST Token:", token);

    const res = await axios.post(
      "https://your-render-backend.onrender.com/api/wipe/start",
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
      device.deviceName?.toLowerCase().includes(search.toLowerCase()) ||
      device.serialNumber?.toLowerCase().includes(search.toLowerCase())
  );

  const totalDevices = devices.length;

  const completedDevices = devices.filter(
    (d) => d.status === "Completed"
  ).length;

  // 🔥 FIX: more reliable active job detection
  const activeJobs = jobs.filter(
    (j) => j.status === "running" || j.status === "pending"
  );

  return (
    <div className="dashboard">

      {/* HEADER */}
      <section className="hero-section">
        <div className="hero-content">
          <p className="hero-label">SECURITY OPERATIONS CENTER</p>
          <h1>TrustWipe Enterprise Console</h1>
          <p>Secure Data Sanitization, Verification & Compliance Platform</p>
        </div>

        <div className="trust-card">
          <FiShield size={50} />
          <h2>{connected ? "ONLINE" : "OFFLINE"}</h2>
          <span>Socket Status</span>
        </div>
      </section>

      {/* STATS */}
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

      {/* MAIN */}
      <div className="dashboard-grid">

        {/* DEVICES */}
        <section className="panel inventory-panel">
          <div className="panel-header">
            <h2>Device Inventory</h2>

            <div className="search-box">
              <FiSearch />
              <input
                value={search}
                placeholder="Search..."
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button
  className="add-btn"
  onClick={handleAddDevice}
>
  + Add Device
</button>
          </div>

          {loading ? (
            <div className="empty">Loading Devices...</div>
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
                  {filteredDevices.map((device) => (
                    <tr key={device._id}>
                      <td>
                        <FiCpu /> {device.deviceName}
                      </td>

                      <td>{device.serialNumber}</td>

                      <td>
                        <span className={`badge ${device.status.toLowerCase()}`}>
                          {device.status}
                        </span>
                      </td>

                      <td>
                        {device.status === "Pending" && (
                          <button
                            className="wipe-btn"
                            onClick={() =>
                              startWipe(device._id, device.deviceName)
                            }
                          >
                            Start Wipe
                          </button>
                        )}

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
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* LIVE OPS */}
        <section className="side-column">
          <div className="panel">
            <h2>Live Operations</h2>

            {activeJobs.length === 0 ? (
              <div className="empty">No Active Jobs</div>
            ) : (
              activeJobs.map((job) => (
                <div className="job-card" key={job._id}>
                  <div className="job-top">
                    <span>Job #{job._id}</span>
                    <span>{job.progress}%</span>
                  </div>

                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{ width: `${job.progress}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

      </div>
      {showAgentPrompt && (
  <div className="agent-modal-overlay">
    <div className="agent-modal">

      <h2>TrustWipe Agent Required</h2>

      <p>
        Before discovering devices, the TrustWipe Agent must be installed
        on this computer.
      </p>

      <div className="agent-features">

        <div>✔ Detects internal & external drives</div>

        <div>✔ Performs certified data wiping</div>

        <div>✔ Streams live wipe progress</div>

        <div>✔ Generates verification evidence</div>

      </div>

      <div className="agent-actions">

        <button
          className="download-btn"
          onClick={downloadAgent}
        >
          Download Agent
        </button>

        <button
          className="cancel-btn"
          onClick={() => setShowAgentPrompt(false)}
        >
          Cancel
        </button>

      </div>

      <div className="agent-note">

        After installation, launch the TrustWipe Agent.
        Once it connects, click <strong>Add Device</strong> again.

      </div>

    </div>
  </div>
)}
    </div>
  );
}

export default Dashboard;