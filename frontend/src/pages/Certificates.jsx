import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./Certificates.css";
import { QRCodeCanvas } from "qrcode.react";

function Certificates() {
  const location = useLocation();
  const navigate = useNavigate();
const [certificate, setCertificate] = useState(null);
const [device, setDevice] = useState(null); 
const certificateRef = useRef(null);

  // ---------------- LOAD CERTIFICATE ----------------
  useEffect(() => {
  const loadCertificate = async () => {
    try {
      let certificateId = null;

      // If coming from navigation state
      if (location.state?.certificate?.certificateId) {
        certificateId =
          location.state.certificate.certificateId;
      }

      // If coming from URL query
      const params = new URLSearchParams(
        location.search
      );

      if (!certificateId) {
        certificateId =
          params.get("certificateId");
      }

      if (!certificateId) {
        console.error(
          "No certificateId found"
        );
        return;
      }

      const res = await axios.get(
        `http://localhost:5000/api/certificate/verify/${certificateId}`
      );

      console.log(
        "CERTIFICATE RESPONSE:",
        res.data
      );

      setCertificate(res.data);
setDevice(null);

    } catch (err) {
      console.error(
        "Certificate load error:",
        err
      );
    }
  };

  loadCertificate();
}, [location]);

  // ---------------- PDF DOWNLOAD (FIXED STABLE RENDER) ----------------
  const downloadPDF = async () => {
  const element = certificateRef.current;

  if (!element) return;

  try {
    // Apply fixed A4 layout
    element.classList.add("pdf-mode");

    await new Promise((resolve) =>
      setTimeout(resolve, 500)
    );

    const canvas = await html2canvas(element, {
  scale: 3,
  useCORS: true,
  backgroundColor: "#ffffff",

  // 🔥 THIS IS THE KEY FIX
  windowWidth: element.scrollWidth,
  windowHeight: element.scrollHeight,

  scrollX: 0,
  scrollY: 0,
});

    const imgData =
      canvas.toDataURL("image/png");

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
      297
    );

    pdf.save(
      `TrustWipe_Certificate_${
        certificate?.certificateId ||
        "certificate"
      }.pdf`
    );

    element.classList.remove("pdf-mode");

  } catch (err) {

    console.error(err);

    element.classList.remove("pdf-mode");

  }
};

  // ---------------- LOADING ----------------
  if (!certificate) {
    return (
      <div className="certificate-page">
        <div className="empty-box">
          <h2>Loading Certificate...</h2>
        </div>
      </div>
    );
  }

  const jobId =
    certificate.jobId ||
    certificate.currentjob ||
    certificate.jobReference ||
    "N/A";

  // ---------------- UI ----------------
  return (
    <div className="certificate-page">

      {/* TOP BAR */}
      <div className="top-actions">
        <button className="primary-btn" onClick={downloadPDF}>
          Download Certificate (PDF)
        </button>

        <button
          className="secondary-btn"
          onClick={() => navigate("/verification")}
        >
          Back
        </button>
      </div>

      {/* ================= CERTIFICATE ================= */}
      <div ref={certificateRef} className="certificate">

  <div className="certificate-header">
    <h1>TRUSTWIPE SECURITY AUTHORITY</h1>

    <h2>DATA SANITIZATION CERTIFICATE</h2>

    <p>
      This certificate confirms the secure, irreversible and
      cryptographically verified destruction of digital data
      in compliance with international security standards.
    </p>

    <div className="verified-badge">
      VERIFIED
    </div>
  </div>

  <div className="section">
    <h3>1. Certification Statement</h3>

    <p>
      The referenced digital asset has undergone secure
      sanitization using TrustWipe verified destruction
      protocols ensuring irreversible data erasure.
    </p>
  </div>

  <div className="two-column">

    <div className="section compact">
      <h3>2. Certificate Details</h3>

      <table>
        <tbody>
          <tr>
            <td>Certificate ID</td>
            <td>{certificate.certificateId}</td>
          </tr>

          <tr>
            <td>Job Reference</td>
            <td>{jobId}</td>
          </tr>

          <tr>
            <td>Status</td>
            <td>{certificate.status}</td>
          </tr>

          <tr>
            <td>Algorithm</td>
            <td>{certificate.algorithm}</td>
          </tr>

          <tr>
            <td>Issue Date</td>
            <td>
              {new Date(
                certificate.createdAt
              ).toLocaleString()}
            </td>
          </tr>

          <tr>
            <td>Authority</td>
            <td>
              TrustWipe Security Authority
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div className="section compact">
      <h3>3. Device Information</h3>

      <table>
        <tbody>
          <tr>
            <td>Model</td>
            <td>{certificate.deviceModel}</td>
          </tr>

          <tr>
            <td>Manufacturer</td>
            <td>
              {certificate.manufacturer ||
                "Dell"}
            </td>
          </tr>

          <tr>
            <td>Serial Number</td>
            <td>
              {certificate.serialNumber}
            </td>
          </tr>

          <tr>
            <td>Storage Type</td>
            <td>
              {certificate.storageType}
            </td>
          </tr>

          <tr>
            <td>Capacity</td>
            <td>
              {certificate.capacity} GB
            </td>
          </tr>

          <tr>
            <td>Status</td>
            <td>Sanitized</td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>

  <div className="two-column">

    <div className="section compact">
      <h3>4. Verification Summary</h3>

      <table>
        <tbody>
          

          <tr>
            <td>Method</td>
            <td>
              {
                certificate.verificationMethod
              }
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div className="section compact">
      <h3>5. Compliance Standards</h3>

      <div className="tags">
        <span>NIST SP 800-88 Rev.1</span>
        <span>ISO 27001</span>
        <span>GDPR</span>
        <span>HIPAA</span>
        <span>DoD 5220.22-M</span>
      </div>
    </div>

  </div>

  <div className="section compact">
    <h3>6. Cryptographic Evidence</h3>

    <label>Verification Hash</label>

    <div className="hash">
      {certificate.verificationHash}
    </div>
  </div>
  
  <div className="section compact">
    <h3>7. Digital Signature</h3>

    <div className="signature-box">
      {certificate.signature}
    </div>

    <p className="note">
      RSA-SHA256 digital signature used
      for tamper-proof validation and
      certificate authenticity.
    </p>
  </div>
  <div className="qr-section">
  <h3>Scan to Verify</h3>

  <QRCodeCanvas
    value={`http://localhost:5173/verify/${certificate.certificateId}`}
    size={90}
    level="H"
  />

  <p className="qr-text">
    Verify authenticity using TrustWipe secure verification system
  </p>
</div>
  <div className="certificate-footer">

    <div>
      <strong>
        Chief Verification Officer
      </strong>
      
      <br />
      TrustWipe Security Authority
    </div>

    <div>
      <strong>
        Cryptographically Verified
      </strong>
      <br />
      Certificate ID:
      {" "}
      {certificate.certificateId}
    </div>

  </div>

</div>
</div>
  );
}

export default Certificates;