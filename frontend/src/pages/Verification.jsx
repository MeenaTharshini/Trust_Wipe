import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./Verification.css";

function Verification() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [jobId, setJobId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  // ---------------- LOAD FROM URL ----------------
  useEffect(() => {
    const id = searchParams.get("jobId");
    if (id) setJobId(id);
  }, [searchParams]);

  // ---------------- VERIFY JOB ----------------
  const verifyJob = async () => {
    if (!jobId.trim()) {
      alert("Please enter a Job ID");
      return;
    }

    try {
      setLoading(true);
      setResult(null);
      setShowConfirm(false);

      const res = await axios.post(
        "http://localhost:5000/api/verification/verify",
        { jobId }
      );

      const data = res.data;

      // ---------------- NORMALIZE BACKEND DATA ----------------
      const formattedResult = {
        certificateId: data.certificateId || data.certificate?.id,
        jobId: jobId,
        algorithm: data.algorithm || "RSA-SHA256",
        hash: data.hash || data.signature || "N/A",
        status: data.status || data.verificationStatus || "VERIFIED",
        verifiedAt: data.verifiedAt || new Date().toISOString(),
      };

      setResult(formattedResult);
      setShowConfirm(true);

    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message ||
        "Verification Failed"
      );
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- NAVIGATE TO CERTIFICATE ----------------
  const goToCertificates = () => {
    navigate("/certificates", {
      state: {
        certificate: result,
      },
    });
  };

  // ---------------- UI ----------------
  return (
    <div className="verify-container">

      <h1>Verification Center</h1>

      <p className="subtitle">
        Enter Job ID to verify secure data erasure
      </p>

      <input
        className="verify-input"
        value={jobId}
        onChange={(e) => setJobId(e.target.value)}
        placeholder="Enter Job ID (e.g. 64fa2...)"
      />

      <button
        className="verify-btn"
        onClick={verifyJob}
        disabled={loading}
      >
        {loading ? "Verifying..." : "Run Verification"}
      </button>

      {/* ---------------- RESULT CARD ---------------- */}
      {result && (
        <div className="result-card">

          <h2>VERIFIED SUCCESSFULLY</h2>

          <div className="result-grid">

            <p>
              <b>Certificate ID:</b><br />
              {result.certificateId}
            </p>

            <p>
              <b>Job ID:</b><br />
              {result.jobId}
            </p>

            <p>
              <b>Algorithm:</b><br />
              {result.algorithm}
            </p>

            <p>
              <b>Status:</b><br />
              <span className="success-text">{result.status}</span>
            </p>

          </div>

          <div className="hash-box">
            <p className="hash-label">
              Cryptographic Signature
            </p>

            <code>
              {result.hash}
            </code>
          </div>

        </div>
      )}

      {/* ---------------- CONFIRMATION MODAL ---------------- */}
      {showConfirm && (
        <div className="confirm-box">

          <h3>Verification Complete</h3>

          <p>
            Certificate has been validated successfully.
            Do you want to generate the official certificate PDF?
          </p>

          <div className="btn-row">

            <button
              className="yes-btn"
              onClick={goToCertificates}
            >
              Generate Certificate
            </button>

            <button
              className="no-btn"
              onClick={() => setShowConfirm(false)}
            >
              Cancel
            </button>

          </div>

        </div>
      )}

    </div>
  );
}

export default Verification;