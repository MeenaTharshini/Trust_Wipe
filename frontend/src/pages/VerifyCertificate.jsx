import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "./VerifyCertificate.css";

function VerifyCertificate() {
  const [certificateId, setCertificateId] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const verifyCertificate = async () => {
    if (!certificateId.trim()) {
      alert("Enter Certificate ID");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.get(
        `http://localhost:5000/api/certificate/verify/${certificateId}`
      );

      navigate(
        `/certificates?certificateId=${certificateId}`,
        {
          state: {
            certificate: res.data,
          },
        }
      );
    } catch (err) {
      alert("Certificate not found");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verify-container">
      <div className="verify-card">
        <h1>Verify Certificate</h1>

        <p className="subtitle">
          Enter your certificate ID to validate authenticity
        </p>

        <input
          className="verify-input"
          type="text"
          placeholder="CERT-XXXXXXXX"
          value={certificateId}
          onChange={(e) => setCertificateId(e.target.value)}
        />

        <button
          className="verify-btn"
          onClick={verifyCertificate}
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify Certificate"}
        </button>
      </div>
    </div>
  );
}

export default VerifyCertificate;