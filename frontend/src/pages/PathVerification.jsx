import { useState } from "react";
import axios from "axios";
import PublicNavbar from "../components/PublicNavbar/PublicNavbar";
import { FiShield, FiCheckCircle, FiXCircle, FiLoader, FiSearch, FiHardDrive } from "react-icons/fi";

import "./PathVerification.css";

function PathVerification() {
  const [deviceId, setDeviceId] = useState("");
  const [path, setPath] = useState("");
  const [state, setState] = useState("idle"); // idle | loading | found | not_found | error
  const [result, setResult] = useState(null);

  const runCheck = async () => {
    if (!deviceId.trim() || !path.trim()) {
      alert("Enter Device ID and Path");
      return;
    }

    try {
      setState("loading");
      setResult(null);

      const res = await axios.post(
        "https://trust-wipe.onrender.com/api/verification/path-check",
        { deviceId, path }
      );

      const data = res.data;
      setResult(data);
      setState(data.exists ? "found" : "not_found");
    } catch (err) {
      console.error(err);
      setState("error");
    }
  };

  const reset = () => {
    setDeviceId("");
    setPath("");
    setResult(null);
    setState("idle");
  };

  return (
    <div className="path-verify-page">
      <PublicNavbar />

      <section className="verify-hero">
        <div>
          <p className="hero-label">PATH VERIFICATION</p>
          <h1>Confirm a Path Was Removed</h1>
          <p className="hero-subtitle">
            Check whether a specific file or folder still exists
            on a wiped device, verified directly by the device agent.
          </p>
        </div>

        <div className="verify-status-card">
          <FiHardDrive />
          <h2>LIVE CHECK</h2>
          <span>Agent-Verified</span>
        </div>
      </section>

      {state === "idle" && (
        <section className="verify-panel">
          <h2>Check a Path</h2>

          <div className="verify-search">
            <FiSearch />
            <input
              value={deviceId}
              onChange={(e) => setDeviceId(e.target.value)}
              placeholder="Device ID or serial number..."
            />
          </div>

          <div className="verify-search">
            <FiSearch />
            <input
              value={path}
              onChange={(e) => setPath(e.target.value)}
              placeholder="Path to check, e.g. D:\Reports\file.xlsx"
            />
          </div>

          <button className="verify-action-btn" onClick={runCheck}>
            Check Path
          </button>
        </section>
      )}

      {state === "loading" && (
        <section className="result-panel">
          <div className="result-header">
            <FiLoader className="spin" />
            <h2>Checking Path...</h2>
          </div>
        </section>
      )}

      {state === "error" && (
        <section className="result-panel">
          <div className="result-header invalid">
            <FiXCircle />
            <h2>Check Failed</h2>
          </div>
          <p>The device is offline or unreachable. Try again once it reconnects.</p>
          <button className="verify-action-btn" onClick={reset}>Try Again</button>
        </section>
      )}

      {state === "not_found" && result && (
        <section className="result-panel">
          <div className="result-header success">
            <FiCheckCircle />
            <h2>Path Not Found</h2>
          </div>

          <div className="result-grid">
            <div className="result-card">
              <span>Path Checked</span>
              <strong>{path}</strong>
            </div>
            <div className="result-card">
              <span>Result</span>
              <strong className="verified">Not present on device</strong>
            </div>
            <div className="result-card">
              <span>Checked At</span>
              <strong>{new Date(result.checkedAt).toLocaleString()}</strong>
            </div>
          </div>

          <div className="certificate-action">
            <button className="certificate-btn" onClick={reset}>Check Another</button>
          </div>
        </section>
      )}

      {state === "found" && result && (
        <section className="result-panel">
          <div className="result-header invalid">
            <FiXCircle />
            <h2>Path Still Exists</h2>
          </div>

          <p>This location is still present on the device. The wipe may be incomplete, or the path may be incorrect.</p>

          <div className="result-grid">
            <div className="result-card">
              <span>Path Checked</span>
              <strong>{path}</strong>
            </div>
            <div className="result-card">
              <span>Checked At</span>
              <strong>{new Date(result.checkedAt).toLocaleString()}</strong>
            </div>
          </div>

          <div className="certificate-action">
            <button className="certificate-btn" onClick={reset}>Check Another</button>
          </div>
        </section>
      )}
    </div>
  );
}

export default PathVerification;