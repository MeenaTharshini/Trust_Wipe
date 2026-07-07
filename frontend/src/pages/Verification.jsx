import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";

import {
  FiShield,
  FiCheckCircle,
  FiSearch,
  FiHash,
  FiFileText,
} from "react-icons/fi";

import "./Verification.css";

function Verification() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [jobId, setJobId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const id = searchParams.get("jobId");
    if (id) setJobId(id);
  }, [searchParams]);

  const verifyJob = async () => {
    if (!jobId.trim()) {
      alert("Please enter Job ID");
      return;
    }
    console.log("Job ID being sent:", jobId);
    try {
      setLoading(true);

      const res = await axios.post(
        "https://trust-wipe.onrender.com/api/verification/verify",
         { jobId }, 
      );

      const data = res.data;

      const formattedResult = {
        certificateId:
          data.certificateId ||
          data.certificate?.id,

        jobId: data.jobId,

        algorithm:
          data.algorithm ||
          "RSA-SHA256",

        hash:
          data.hash ||
          data.signature ||
          "N/A",

        status:
          data.status ||
          data.verificationStatus ||
          "VERIFIED",

        verifiedAt:
          data.verifiedAt ||
          new Date().toISOString(),
      };

      setResult(formattedResult);
      setShowConfirm(true);

    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Verification Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const goToCertificates = () => {
    navigate("/certificates", {
      state: {
        certificate: result,
      },
    });
  };

  return (
    <div className="verification-page">

      {/* HERO */}
      <section className="verify-hero">

        <div>
          <p className="hero-label">
            CERTIFICATE VALIDATION
          </p>

          <h1>
            Verification Center
          </h1>

          <p className="hero-subtitle">
            Verify secure data sanitization
            certificates and generate
            compliance reports.
          </p>
        </div>

        <div className="verify-status-card">
          <FiShield />

          <h2>
            Secure
          </h2>

          <span>
            TrustWipe Validation
          </span>
        </div>

      </section>

      {/* SEARCH PANEL */}

      <section className="verify-panel">

        <h2>
          Verify Certificate
        </h2>

        <div className="verify-search">

          <FiSearch />

          <input
            value={jobId}
            onChange={(e) =>
              setJobId(e.target.value)
            }
            placeholder="Enter Job ID..."
          />

        </div>

        <button
          className="verify-action-btn"
          onClick={verifyJob}
          disabled={loading}
        >
          {loading
            ? "Verifying..."
            : "Run Verification"}
        </button>

      </section>

      {/* RESULT */}

      {result && (
        <section className="result-panel">

          <div className="result-header">
            <FiCheckCircle />

            <h2>
              Verification Successful
            </h2>
          </div>

          <div className="result-grid">

            <div className="result-card">
              <span>
                Certificate ID
              </span>

              <strong>
                {result.certificateId}
              </strong>
            </div>

            <div className="result-card">
              <span>
                Job ID
              </span>

              <strong>
                {result.jobId}
              </strong>
            </div>

            <div className="result-card">
              <span>
                Algorithm
              </span>

              <strong>
                {result.algorithm}
              </strong>
            </div>

            <div className="result-card">
              <span>
                Status
              </span>

              <strong className="verified">
                {result.status}
              </strong>
            </div>

          </div>

          <div className="hash-panel">

            <div className="hash-title">
              <FiHash />
              Cryptographic Signature
            </div>

            <code>
              {result.hash}
            </code>

          </div>

          <div className="certificate-action">

            <button
              className="certificate-btn"
              onClick={goToCertificates}
            >
              <FiFileText />
              Generate Certificate
            </button>

          </div>

        </section>
      )}

      {/* POPUP */}

      {showConfirm && (
        <div className="popup-overlay">

          <div className="popup-card">

            <h2>
              Verification Complete
            </h2>

            <p>
              Certificate validated
              successfully.
            </p>

            <div className="popup-buttons">

              <button
                className="generate-btn"
                onClick={goToCertificates}
              >
                Generate PDF
              </button>

              <button
                className="cancel-btn"
                onClick={() =>
                  setShowConfirm(false)
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

export default Verification;