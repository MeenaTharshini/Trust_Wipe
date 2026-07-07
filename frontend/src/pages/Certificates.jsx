import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./Certificates.css";
import { QRCodeCanvas } from "qrcode.react";
import trustwipeLogo from "../assets/trustwipe-logo.png";

function Certificates() {
  const location = useLocation();
  const navigate = useNavigate();

  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);

  const certificateRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        const id =
          location.state?.certificate?.certificateId ||
          new URLSearchParams(location.search).get("certificateId");

        if (!id) return;

        const token = localStorage.getItem("token");

const res = await axios.get(
  `https://trust-wipe.onrender.com/api/certificate/verify/${id}`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

        setCertificate(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    load();
  }, [location]);

  const downloadPDF = async () => {
  const element = certificateRef.current;
  if (!element) return;

  const canvas = await html2canvas(element, {
    scale: 4,
    useCORS: true,
    backgroundColor: "#ffffff",
  });

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  pdf.addImage(
    imgData,
    "PNG",
    0,
    0,
    210,
    297,
    undefined,
    "FAST"
  );

  pdf.save(
    `TrustWipe_${certificate.certificateId}.pdf`
  );
};

  if (loading) return <div className="certificate-page">Loading...</div>;
  if (!certificate) return <div className="certificate-page">Not Found</div>;

  const jobId =
    certificate.jobId ||
    certificate.currentjob ||
    certificate.jobReference ||
    "N/A";

  return (
    <div className="certificate-page">
      <div className="top-actions no-print">
        <button className="primary-btn" onClick={downloadPDF}>
          Download Certificate
        </button>
        <button className="secondary-btn" onClick={() => navigate("/verification")}>
          Back
        </button>
      </div>

      <div ref={certificateRef} className="certificate">

  {/* OUTER FRAME */}
  <div className="outer-border">

    {/* INNER FRAME */}
    <div className="inner-border">

      {/* HEADER */}
      <div className="certificate-header">

        <div className="logo-section">
  <img
    src={trustwipeLogo}
    alt="TrustWipe Logo"
    className="trustwipe-logo"
  />
</div>

        <div className="title-section">
          <h1>TRUSTWIPE SECURITY AUTHORITY</h1>
          <h2>DATA SANITIZATION CERTIFICATE</h2>

          <p className="cert-number">
            Certificate No. {certificate.certificateId}
          </p>
        </div>

        <div className="verified-stamp">
          VERIFIED
        </div>

      </div>

      <div className="gold-line"></div>

      {/* CERTIFICATE TEXT */}
      <div className="certificate-body">

        <h3>CERTIFICATE OF SECURE DATA DESTRUCTION</h3>

        <p className="statement">
          This certificate officially confirms that the digital storage media
          described below has undergone secure irreversible sanitization using
          approved TrustWipe destruction protocols and has been successfully
          verified under NIST SP 800-88 Rev.1 standards.
        </p>

      </div>

      {/* DETAILS */}
      <div className="details-grid">

        <div className="info-card">
          <h4>Certificate Details</h4>

          <table>
            <tbody>
              <tr>
                <td>Job ID</td>
                <td>{jobId}</td>
              </tr>

              <tr>
                <td>Status</td>
                <td>{certificate.verificationStatus}</td>
              </tr>

              <tr>
                <td>Algorithm</td>
                <td>{certificate.algorithm}</td>
              </tr>

              <tr>
                <td>Standard</td>
                <td>{certificate.sanitizationStandard}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="info-card">
          <h4>Device Information</h4>

          <table>
            <tbody>
              <tr>
                <td>Model</td>
                <td>{certificate.deviceModel}</td>
              </tr>

              <tr>
                <td>Serial</td>
                <td>{certificate.serialNumber}</td>
              </tr>

              <tr>
                <td>Storage</td>
                <td>{certificate.storageType}</td>
              </tr>

              <tr>
                <td>Capacity</td>
                <td>{certificate.capacity}</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>

      {/* METRICS */}
      <div className="metrics-row">

        <div className="metric-box">
          <span>Files Wiped</span>
          <strong>{certificate.wipedFiles}</strong>
        </div>

        <div className="metric-box">
          <span>Verified</span>
          <strong>{certificate.verifiedFiles}</strong>
        </div>

        <div className="metric-box">
          <span>Failures</span>
          <strong>{certificate.verificationFailures}</strong>
        </div>

      </div>

      {/* HASH */}
      <div className="hash-section">

        <h4>Verification Hash</h4>

        <div className="hash-box">
          {certificate.verificationHash}
        </div>

      </div>

      {/* BOTTOM */}
      <div className="bottom-section">

        <div className="seal-area">
          <div className="official-seal">
            TRUSTWIPE
            <br />
            AUTHORIZED
          </div>
        </div>

        <div className="signature-area">

          <h4>Digital Signature</h4>

          <div className="signature-status">
            ✓ Signature Verified
          </div>

          <div className="crypto-info">
            RSA-4096 | SHA-256
          </div>

          <div className="signature-preview">
            {certificate.signature?.substring(0, 40)}...
          </div>

        </div>

        <div className="qr-area">

          <QRCodeCanvas
            value={`https://trust-wipe-tau.vercel.app/verify/${certificate.certificateId}`}
            size={90}
            level="H"
          />

          <p>Scan to Verify</p>

        </div>

      </div>

      {/* FOOTER */}
      <div className="footer">

        <div>
          <strong>Chief Verification Officer</strong>
        </div>

        <div>
          {certificate.certificateId}
        </div>

      </div>

      <div className="legal-note">
        This document is digitally generated by TrustWipe Security Authority.
        Any modification invalidates authenticity.
      </div>

    </div>
  </div>
</div>
    </div>
  );
}

export default Certificates;
