import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import PublicNavbar from "../components/PublicNavbar/PublicNavbar";
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
  const { id } = useParams();

  const [certificateId, setCertificateId] = useState("");
  const [state, setState] = useState("idle");

  const [cert, setCert] = useState(null);

  useEffect(() => {
    if (id) {
      runVerification(id);
    }
  }, [id]);

  const runVerification = async (inputId) => {
    const finalId = inputId || certificateId;

    if (!finalId.trim()) {
      alert("Enter Certificate ID");
      return;
    }

    try {
      setState("loading");
      setCert(null);

      const res = await axios.get(
        `https://trust-wipe.onrender.com/api/certificate/verify/${finalId}`
      );

      const data = res.data;

      const valid =
        data &&
        data.certificateId &&
        data.verificationHash &&
        data.verificationStatus === "VERIFIED";

      if (!valid) {
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

  return (
    <div className="verify-certificate-page">
       <PublicNavbar />
      {/* HERO */}
      <section className="verify-hero">

        <div>
          <p className="hero-label">
            CERTIFICATE AUTHENTICATION
          </p>

          <h1>
            TrustWipe Verification Portal
          </h1>

          <p className="hero-subtitle">
            Validate destruction certificates,
            cryptographic signatures and
            compliance records.
          </p>
        </div>

        <div className="verify-status-card">
          <FiShield />
          <h2>SECURE</h2>
          <span>TrustWipe Network</span>
        </div>

      </section>

      {/* SEARCH PANEL */}

      {state === "idle" && (
        <section className="verify-panel">

          <h2>
            Verify Certificate
          </h2>

          <div className="verify-search">

            <FiSearch />

            <input
              value={certificateId}
              onChange={(e) =>
                setCertificateId(e.target.value)
              }
              placeholder="Enter Certificate ID..."
            />

          </div>

          <button
            className="verify-action-btn"
            onClick={() => runVerification()}
          >
            Verify Certificate
          </button>

        </section>
      )}

      {/* LOADING */}

      {state === "loading" && (
        <section className="result-panel">

          <div className="result-header">
            <FiLoader className="spin" />
            <h2>
              Verifying Certificate...
            </h2>
          </div>

        </section>
      )}

      {/* INVALID */}

      {state === "invalid" && (
        <section className="result-panel">

          <div className="result-header invalid">
            <FiXCircle />
            <h2>
              Verification Failed
            </h2>
          </div>

          <p>
            Certificate not found or integrity
            validation failed.
          </p>

          <button
            className="verify-action-btn"
            onClick={reset}
          >
            Try Again
          </button>

        </section>
      )}

      {/* VALID */}

      {state === "valid" && cert && (
        <section className="result-panel">

          <div className="result-header success">
            <FiCheckCircle />
            <h2>
              Certificate Verified
            </h2>
          </div>

          <div className="result-grid">

            <div className="result-card">
              <span>Certificate ID</span>
              <strong>
                {cert.certificateId}
              </strong>
            </div>

            <div className="result-card">
              <span>Status</span>
              <strong className="verified">
                {cert.verificationStatus}
              </strong>
            </div>

            <div className="result-card">
              <span>Algorithm</span>
              <strong>
                {cert.algorithm}
              </strong>
            </div>

            <div className="result-card">
              <span>Generated</span>
              <strong>
                {new Date(
                  cert.createdAt
                ).toLocaleString()}
              </strong>
            </div>

          </div>

          <div className="result-grid">

            <div className="result-card">
              <span>Device Model</span>
              <strong>
                {cert.deviceModel}
              </strong>
            </div>

            <div className="result-card">
              <span>Serial Number</span>
              <strong>
                {cert.serialNumber}
              </strong>
            </div>

            <div className="result-card">
              <span>Storage Type</span>
              <strong>
                {cert.storageType}
              </strong>
            </div>

            <div className="result-card">
              <span>Capacity</span>
              <strong>
                {cert.capacity} GB
              </strong>
            </div>

          </div>

          <div className="hash-panel">

            <div className="hash-title">
              <FiHash />
              Verification Hash
            </div>

            <code>
              {cert.verificationHash}
            </code>

          </div>

          <div className="certificate-action">

            <button
              className="certificate-btn"
              onClick={reset}
            >
              Verify Another
            </button>

          </div>

        </section>
      )}

    </div>
  );
}

export default VerifyCertificate;