
import { useEffect, useState } from "react";
import axios from "axios";

import {
  FiShield,
  FiCheckCircle,
  FiXCircle,
  FiLoader,
  FiSearch,
  FiHardDrive,
  FiFolder,
  FiFile,
  FiRefreshCw,
  FiAlertTriangle,
  FiClock,
  FiDatabase,
  FiActivity,
} from "react-icons/fi";

import "./PathVerification.css";

function PathVerification() {
  const [devices, setDevices] = useState([]);

  const [deviceId, setDeviceId] = useState("");
  const [path, setPath] = useState("");
  const [verificationType, setVerificationType] = useState("auto");

  const [state, setState] = useState("idle");
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // =========================================================
  // LOAD REGISTERED DEVICES
  // =========================================================

  useEffect(() => {
    const loadDevices = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setErrorMessage("Authentication session expired. Please login again.");
          return;
        }

        const res = await axios.get(
          "https://trust-wipe.onrender.com/api/devices",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setDevices(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error(
          "DEVICE LOAD ERROR:",
          error.response?.data || error.message
        );

        setErrorMessage(
          error.response?.data?.message ||
            "Unable to load registered devices."
        );
      }
    };

    loadDevices();
  }, []);

  // =========================================================
  // VALIDATE INPUT
  // =========================================================

  const validateInput = () => {
    if (!deviceId.trim()) {
      setErrorMessage("Select a target device before verification.");
      return false;
    }

    if (!path.trim()) {
      setErrorMessage("Enter the file or folder path to verify.");
      return false;
    }

    if (path.trim().length < 2) {
      setErrorMessage("Enter a valid absolute path.");
      return false;
    }

    return true;
  };

  // =========================================================
  // RUN VERIFICATION
  // =========================================================

  const runCheck = async () => {
    setErrorMessage("");

    if (!validateInput()) {
      return;
    }

    try {
      setState("loading");
      setResult(null);

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token missing.");
      }

      const payload = {
        deviceId: deviceId.trim(),
        path: path.trim(),
        verificationType,
      };

      console.log("PATH VERIFICATION REQUEST:", payload);

      const res = await axios.post(
        "https://trust-wipe.onrender.com/api/verification/path-check",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("PATH VERIFICATION RESPONSE:", res.data);

      const data = res.data;

      setResult(data);

      if (data.exists === true) {
        setState("found");
      } else if (data.exists === false) {
        setState("not_found");
      } else {
        setState("error");
        setErrorMessage(
          "The verification service returned an invalid response."
        );
      }
    } catch (error) {
      console.error(
        "PATH VERIFICATION ERROR:",
        error.response?.data || error.message
      );

      setState("error");

      if (error.response?.status === 401) {
        setErrorMessage(
          "Your session has expired. Please login again."
        );
        return;
      }

      if (error.response?.status === 403) {
        setErrorMessage(
          "You are not authorized to verify paths on this device."
        );
        return;
      }

      if (error.response?.status === 404) {
        setErrorMessage(
          "The path verification service is not available on the server. Check that the /api/verification/path-check backend route is deployed."
        );
        return;
      }

      if (error.response?.status === 500) {
        setErrorMessage(
          error.response?.data?.message ||
            "The verification server encountered an internal error."
        );
        return;
      }

      setErrorMessage(
        error.response?.data?.message ||
          "Unable to reach the TrustWipe Agent. Make sure the device is online and the TrustWipe Agent is running."
      );
    }
  };

  // =========================================================
  // RESET
  // =========================================================

  const reset = () => {
    setPath("");
    setResult(null);
    setErrorMessage("");
    setState("idle");
  };

  // =========================================================
  // SELECTED DEVICE
  // =========================================================

  const selectedDevice = devices.find(
    (device) =>
      device._id === deviceId ||
      device.serialNumber === deviceId
  );

  const deviceName =
    selectedDevice?.deviceName ||
    selectedDevice?.serialNumber ||
    deviceId ||
    "Unknown Device";

  // =========================================================
  // DATE FORMATTER
  // =========================================================

  const formatDate = (date) => {
    if (!date) return "Not available";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "Not available";
    }

    return parsed.toLocaleString();
  };

  // =========================================================
  // RESULT HELPERS
  // =========================================================

  const getCheckedAt = () =>
    result?.checkedAt ||
    result?.verifiedAt ||
    result?.timestamp ||
    result?.createdAt;

  const getVerificationId = () =>
    result?.verificationId ||
    result?.verification_id ||
    result?._id ||
    null;

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="path-verify-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="verify-hero">

        <div className="verify-hero-content">

          <div className="hero-label">
            <FiShield />
            TRUSTWIPE VERIFICATION ENGINE
          </div>

          <h1>
            Path Verification
          </h1>

          <p className="hero-subtitle">
            Independently verify whether a specific file or
            directory remains on a target device after
            sanitization.
          </p>

          <div className="verification-trust-line">

            <span>
              <FiCheckCircle />
              Agent-side verification
            </span>

            <span>
              <FiShield />
              Evidence-oriented
            </span>

            <span>
              <FiActivity />
              Real-time check
            </span>

          </div>

        </div>

        {/* STATUS CARD */}

        <div className="verify-status-card">

          <div className="status-icon">
            <FiHardDrive />
          </div>

          <span className="status-title">
            VERIFICATION STATUS
          </span>

          <strong>
            {state === "loading"
              ? "CHECKING"
              : state === "idle"
              ? "READY"
              : state === "not_found"
              ? "VERIFIED"
              : state === "found"
              ? "ACTION REQUIRED"
              : "UNAVAILABLE"}
          </strong>

          <small>
            {selectedDevice
              ? deviceName
              : "No device selected"}
          </small>

        </div>

      </section>

      {/* =====================================================
          VERIFICATION FORM
      ===================================================== */}

      {state === "idle" && (

        <section className="verify-panel">

          <div className="panel-heading">

            <div className="panel-heading-icon">
              <FiSearch />
            </div>

            <div>

              <span className="section-kicker">
                NEW VERIFICATION
              </span>

              <h2>
                Verify a File or Folder
              </h2>

              <p>
                Select a target device and specify the exact
                path you want the TrustWipe Agent to inspect.
              </p>

            </div>

          </div>

          {/* DEVICE */}

          <div className="form-group">

            <label>
              Target Device
            </label>

            {devices.length > 0 ? (

              <div className="select-wrapper">

                <FiHardDrive />

                <select
                  value={deviceId}
                  onChange={(e) => {
                    setDeviceId(e.target.value);
                    setErrorMessage("");
                  }}
                >

                  <option value="">
                    Select a device...
                  </option>

                  {devices.map((device) => (

                    <option
                      key={device._id}
                      value={device._id}
                    >
                      {device.deviceName ||
                        device.serialNumber ||
                        device._id}
                    </option>

                  ))}

                </select>

              </div>

            ) : (

              <div className="input-with-icon">

                <FiHardDrive />

                <input
                  value={deviceId}
                  onChange={(e) => {
                    setDeviceId(e.target.value);
                    setErrorMessage("");
                  }}
                  placeholder="Device ID or serial number"
                />

              </div>

            )}

          </div>

          {/* PATH */}

          <div className="form-group">

            <label>
              Path to Verify
            </label>

            <div className="input-with-icon path-input">

              <FiSearch />

              <input
                value={path}
                onChange={(e) => {
                  setPath(e.target.value);
                  setErrorMessage("");
                }}
                placeholder={"Example: D:\\Reports\\confidential.xlsx"}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    runCheck();
                  }
                }}
              />

            </div>

            <small className="field-hint">
              Enter the exact absolute path as it existed on
              the target device.
            </small>

          </div>

          {/* VERIFICATION TYPE */}

          <div className="form-group">

            <label>
              Verification Target
            </label>

            <div className="verification-types">

              <button
                type="button"
                className={
                  verificationType === "auto"
                    ? "type-card active"
                    : "type-card"
                }
                onClick={() =>
                  setVerificationType("auto")
                }
              >

                <FiSearch />

                <div>
                  <strong>Auto Detect</strong>
                  <span>File or folder</span>
                </div>

              </button>

              <button
                type="button"
                className={
                  verificationType === "file"
                    ? "type-card active"
                    : "type-card"
                }
                onClick={() =>
                  setVerificationType("file")
                }
              >

                <FiFile />

                <div>
                  <strong>File</strong>
                  <span>Verify a file</span>
                </div>

              </button>

              <button
                type="button"
                className={
                  verificationType === "folder"
                    ? "type-card active"
                    : "type-card"
                }
                onClick={() =>
                  setVerificationType("folder")
                }
              >

                <FiFolder />

                <div>
                  <strong>Folder</strong>
                  <span>Verify a directory</span>
                </div>

              </button>

            </div>

          </div>

          {/* SECURITY NOTICE */}

          <div className="verification-notice">

            <FiShield />

            <div>

              <strong>
                Agent-side verification
              </strong>

              <p>
                The requested path is checked directly against
                the target device through the TrustWipe Agent.
                The dashboard does not assume deletion based
                solely on database records.
              </p>

            </div>

          </div>

          {/* ERROR */}

          {errorMessage && (

            <div className="inline-error">

              <FiAlertTriangle />

              <span>
                {errorMessage}
              </span>

            </div>

          )}

          {/* ACTION */}

          <button
            className="verify-action-btn"
            onClick={runCheck}
            disabled={
              !deviceId.trim() ||
              !path.trim()
            }
          >
            <FiShield />
            Verify Path
          </button>

        </section>

      )}

      {/* =====================================================
          LOADING
      ===================================================== */}

      {state === "loading" && (

        <section className="result-panel verification-loading">

          <div className="loading-icon">
            <FiLoader className="spin" />
          </div>

          <span className="section-kicker">
            LIVE VERIFICATION
          </span>

          <h2>
            Inspecting Target Path
          </h2>

          <p>
            TrustWipe is requesting the agent to verify the
            selected path on the target device.
          </p>

          <div className="verification-steps">

            <div className="verification-step active">
              <FiCheckCircle />
              <span>
                Verification request submitted
              </span>
            </div>

            <div className="verification-step active">
              <FiLoader className="spin" />
              <span>
                Contacting device agent
              </span>
            </div>

            <div className="verification-step">
              <FiSearch />
              <span>
                Inspecting requested path
              </span>
            </div>

            <div className="verification-step">
              <FiDatabase />
              <span>
                Recording verification evidence
              </span>
            </div>

          </div>

        </section>

      )}

      {/* =====================================================
          VERIFIED
      ===================================================== */}

      {state === "not_found" && result && (

        <section className="result-panel success-panel">

          <div className="result-icon success">
            <FiCheckCircle />
          </div>

          <span className="section-kicker">
            VERIFICATION PASSED
          </span>

          <h2>
            Path Not Found
          </h2>

          <p className="result-description">
            The TrustWipe Agent confirmed that the requested
            path is not present on the target device at the
            time of verification.
          </p>

          <div className="verification-result-banner success">

            <FiCheckCircle />

            <div>
              <strong>
                Path absence confirmed
              </strong>

              <span>
                Agent-reported result
              </span>
            </div>

          </div>

          <div className="result-grid">

            <div className="result-card">

              <span>
                <FiSearch />
                Path Checked
              </span>

              <strong className="path-value">
                {path}
              </strong>

            </div>

            <div className="result-card">

              <span>
                <FiHardDrive />
                Device
              </span>

              <strong>
                {deviceName}
              </strong>

            </div>

            <div className="result-card">

              <span>
                <FiClock />
                Checked At
              </span>

              <strong>
                {formatDate(getCheckedAt())}
              </strong>

            </div>

            {getVerificationId() && (

              <div className="result-card">

                <span>
                  <FiDatabase />
                  Verification ID
                </span>

                <strong>
                  {getVerificationId()}
                </strong>

              </div>

            )}

          </div>

          <div className="result-actions">

            <button
              className="certificate-btn primary"
              onClick={reset}
            >
              <FiRefreshCw />
              Verify Another Path
            </button>

          </div>

        </section>

      )}

      {/* =====================================================
          PATH FOUND
      ===================================================== */}

      {state === "found" && result && (

        <section className="result-panel danger-panel">

          <div className="result-icon danger">
            <FiXCircle />
          </div>

          <span className="section-kicker">
            VERIFICATION FAILED
          </span>

          <h2>
            Path Still Exists
          </h2>

          <p className="result-description">
            The TrustWipe Agent found the requested path on
            the target device. Do not treat this device as
            fully verified until the issue has been investigated.
          </p>

          <div className="verification-result-banner danger">

            <FiAlertTriangle />

            <div>
              <strong>
                Path presence detected
              </strong>

              <span>
                Further investigation recommended
              </span>
            </div>

          </div>

          <div className="result-grid">

            <div className="result-card">

              <span>
                <FiSearch />
                Path Detected
              </span>

              <strong className="path-value">
                {path}
              </strong>

            </div>

            <div className="result-card">

              <span>
                <FiHardDrive />
                Device
              </span>

              <strong>
                {deviceName}
              </strong>

            </div>

            <div className="result-card">

              <span>
                <FiClock />
                Checked At
              </span>

              <strong>
                {formatDate(getCheckedAt())}
              </strong>

            </div>

            {getVerificationId() && (

              <div className="result-card">

                <span>
                  <FiDatabase />
                  Verification ID
                </span>

                <strong>
                  {getVerificationId()}
                </strong>

              </div>

            )}

          </div>

          <div className="result-actions">

            <button
              className="certificate-btn"
              onClick={reset}
            >
              <FiRefreshCw />
              Check Again
            </button>

          </div>

        </section>

      )}

      {/* =====================================================
          ERROR
      ===================================================== */}

      {state === "error" && (

        <section className="result-panel error-panel">

          <div className="result-icon error">
            <FiXCircle />
          </div>

          <span className="section-kicker">
            VERIFICATION UNAVAILABLE
          </span>

          <h2>
            Unable to Complete Verification
          </h2>

          <p className="result-description">
            {errorMessage ||
              "The device could not be reached or the verification request failed."}
          </p>

          <div className="error-help">

            <FiAlertTriangle />

            <div>

              <strong>
                Check the following:
              </strong>

              <ul>

                <li>
                  The TrustWipe Agent is running.
                </li>

                <li>
                  The device is connected.
                </li>

                <li>
                  The device is registered with TrustWipe.
                </li>

                <li>
                  The requested path is valid.
                </li>

                <li>
                  The backend verification route is deployed.
                </li>

              </ul>

            </div>

          </div>

          <div className="result-actions">

            <button
              className="certificate-btn primary"
              onClick={reset}
            >
              <FiRefreshCw />
              Try Again
            </button>

          </div>

        </section>

      )}

    </div>
  );
}

export default PathVerification;
