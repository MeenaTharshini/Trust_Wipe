import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import {
  FiShield,
  FiCheckCircle,
  FiXCircle,
  FiLoader,
  FiSearch,
  FiCpu,
  FiDatabase,
  FiHash,
} from "react-icons/fi";

import "./VerifyCertificate.css";

function VerifyCertificate() {
  const { id } = useParams(); // QR mode
  const [certificateId, setCertificateId] = useState("");

  const [state, setState] = useState("idle"); // idle | loading | valid | invalid
  const [cert, setCert] = useState(null);

  // auto verify if QR opens /verify/:id
  useEffect(() => {
    if (id) {
      runVerification(id);
    }
  }, [id]);

  // MAIN VERIFY FUNCTION
  const runVerification = async (inputId) => {
    const finalId = inputId || certificateId;

    if (!finalId?.trim()) {
      alert("Enter Certificate ID");
      return;
    }

    try {
      setState("loading");
      setCert(null);

      const res = await axios.get(
        `http://localhost:5000/api/certificate/verify/${finalId}`
      );

      const data = res.data;

      const isValid =
        data?.certificateId &&
        data?.verificationHash &&
        data?.status === "VERIFIED";

      if (!isValid) {
        setState("invalid");
        return;
      }

      setCert(data);
      setState("valid");
    } catch (err) {
      console.error(err);
      setState("invalid");
    }
  };

  const reset = () => {
    setCertificateId("");
    setCert(null);
    setState("idle");
  };

  // ================= LOADING =================
  if (state === "loading") {
    return (
      <div className="vp-container">
        <div className="vp-card loading">
          <FiLoader className="spin" size={40} />
          <h2>Verifying Certificate</h2>
          <p>Checking TrustWipe secure network...</p>
        </div>
      </div>
    );
  }

  // ================= INVALID =================
  if (state === "invalid") {
    return (
      <div className="vp-container">
        <div className="vp-card danger">
          <FiXCircle size={50} />
          <h1>Verification Failed</h1>
          <p>Certificate not found or integrity check failed.</p>

          <button onClick={reset}>Try Again</button>
        </div>
      </div>
    );
  }

  // ================= VALID =================
  if (state === "valid" && cert) {
    return (
      <div className="vp-container">

        <div className="vp-card success">
          <FiCheckCircle size={45} />
          <h1>Certificate Verified</h1>
          <p>Authenticity confirmed by TrustWipe Network</p>
        </div>

        <div className="vp-grid">

          <div className="vp-box">
            <h3><FiShield /> Security Status</h3>
            <p>VERIFIED ✓</p>
            <span className="tag green">Tamper Proof</span>
          </div>

          <div className="vp-box">
            <h3><FiCpu /> Certificate Info</h3>
            <p><b>ID:</b> {cert.certificateId}</p>
            <p><b>Status:</b> {cert.status}</p>
            <p><b>Algorithm:</b> {cert.algorithm}</p>
            <p>
              <b>Generated On:</b>{" "}
              {new Date(cert.createdAt).toLocaleString()}
            </p>
          </div>

          <div className="vp-box">
            <h3><FiDatabase /> Device Info</h3>
            <p><b>Model:</b> {cert.deviceModel}</p>
            <p><b>Serial:</b> {cert.serialNumber}</p>
            <p><b>Storage:</b> {cert.storageType}</p>
            <p><b>Capacity:</b> {cert.capacity} GB</p>
          </div>

          <div className="vp-box full">
            <h3><FiHash /> Verification Hash</h3>
            <code>{cert.verificationHash}</code>
          </div>

        </div>

        <div className="action-row">
          <a
            className="download"
            href={`/certificates?certificateId=${cert.certificateId}`}
          >
            Download Certificate
          </a>

          <button onClick={reset}>
            Verify Another
          </button>
        </div>

      </div>
    );
  }

  // ================= DEFAULT (MANUAL INPUT UI) =================
  return (
  <div className="verify-page">

    {/* HERO */}
    <section className="verify-hero">

      <div className="hero-content">

        <p className="hero-label">
          CERTIFICATE AUTHENTICATION
        </p>

        <h1>
          TrustWipe Verification Portal
        </h1>

        <p>
          Validate digital destruction certificates,
          cryptographic signatures and compliance records.
        </p>

      </div>

      <div className="trust-card">

        <FiShield size={50} />

        <h2>
          SECURE
        </h2>

        <span>
          Verification Network
        </span>

      </div>

    </section>

    {/* SEARCH PANEL */}

    {state === "idle" && (

      <section className="panel">

        <h2>
          Verify Certificate
        </h2>

        <div className="search-box">

          <FiSearch />

          <input
            value={certificateId}
            onChange={(e) =>
              setCertificateId(
                e.target.value
              )
            }
            placeholder="Enter Certificate ID..."
          />

        </div>

        <button
          className="verify-btn"
          onClick={() =>
            runVerification()
          }
        >
          Verify Certificate
        </button>

      </section>

    )}

    {/* LOADING */}

    {state === "loading" && (

      <section className="panel center-panel">

        <FiLoader
          size={50}
          className="spin"
        />

        <h2>
          Verifying Certificate
        </h2>

        <p>
          Checking TrustWipe secure network...
        </p>

      </section>

    )}

    {/* INVALID */}

    {state === "invalid" && (

      <section className="panel center-panel">

        <FiXCircle
          size={50}
          className="danger-icon"
        />

        <h2>
          Verification Failed
        </h2>

        <p>
          Certificate not found or
          integrity validation failed.
        </p>

        <button
          className="verify-btn"
          onClick={reset}
        >
          Try Again
        </button>

      </section>

    )}

    {/* VERIFIED */}

    {state === "valid" && cert && (

      <>

        <section className="stats-grid">

          <div className="stat-card success">
            <FiCheckCircle />
            <div>
              <span>Status</span>
              <h2>VALID</h2>
            </div>
          </div>

          <div className="stat-card">
            <FiShield />
            <div>
              <span>Security</span>
              <h2>100%</h2>
            </div>
          </div>

          <div className="stat-card">
            <FiCpu />
            <div>
              <span>Algorithm</span>
              <h2>
                {cert.algorithm}
              </h2>
            </div>
          </div>

        </section>

        <section className="verify-grid">

          <div className="panel">

            <h2>
              Certificate Information
            </h2>

            <div className="info-grid">

              <div>
                <span>Certificate ID</span>
                <strong>
                  {cert.certificateId}
                </strong>
              </div>

              <div>
                <span>Status</span>
                <strong>
                  {cert.status}
                </strong>
              </div>

              <div>
                <span>Algorithm</span>
                <strong>
                  {cert.algorithm}
                </strong>
              </div>

              <div>
                <span>Generated</span>
                <strong>
                  {new Date(
                    cert.createdAt
                  ).toLocaleString()}
                </strong>
              </div>

            </div>

          </div>

          <div className="panel">

            <h2>
              Device Information
            </h2>

            <div className="info-grid">

              <div>
                <span>Model</span>
                <strong>
                  {cert.deviceModel}
                </strong>
              </div>

              <div>
                <span>Serial Number</span>
                <strong>
                  {cert.serialNumber}
                </strong>
              </div>

              <div>
                <span>Storage</span>
                <strong>
                  {cert.storageType}
                </strong>
              </div>

              <div>
                <span>Capacity</span>
                <strong>
                  {cert.capacity} GB
                </strong>
              </div>

            </div>

          </div>

        </section>

        <section className="panel">

          <h2>
            Verification Hash
          </h2>

          <div className="hash-box">
            {cert.verificationHash}
          </div>

        </section>

        <div className="action-row">

          <a
            className="download-btn"
            href={`/certificates?certificateId=${cert.certificateId}`}
          >
            Download Certificate
          </a>

          <button
            className="secondary-btn"
            onClick={reset}
          >
            Verify Another
          </button>

        </div>

      </>

    )}

  </div>
);
}

export default VerifyCertificate;