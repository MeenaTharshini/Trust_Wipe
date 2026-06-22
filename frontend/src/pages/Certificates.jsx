import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./Certificates.css";

function Certificates() {
  const location = useLocation();
  const navigate = useNavigate();

const [certificate, setCertificate] = useState(null);
const [certificates, setCertificates] = useState([]);  
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

    const canvas = await html2canvas(
      element,
      {
        scale: 4,
        useCORS: true,
        backgroundColor: "#ffffff",
        width: 794,
        height: 1123,
        windowWidth: 794,
        windowHeight: 1123,
      }
    );

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

        {/* WATERMARK */}
        <div className="watermark">TRUSTWIPE VERIFIED</div>

        {/* HEADER */}
        <div className="header">
          <div className="title-block">
            <h1>TRUSTWIPE SECURITY AUTHORITY</h1>
            <h2>DATA SANITIZATION CERTIFICATE</h2>

            <p>
              This certificate confirms the secure, irreversible and
              cryptographically verified destruction of digital data in compliance
              with international security standards.
            </p>
          </div>

          <div className="seal">VERIFIED</div>
        </div>

        <div className="divider" />

        {/* SECTION 1 */}
        <div className="section">
          <h3>1. Certification Statement</h3>
          <p>
            The referenced digital asset has undergone secure sanitization using
            TrustWipe verified destruction protocols ensuring irreversible data erasure.
          </p>
        </div>

        {/* SECTION 2 */}
        <div className="section">
          <h3>2. Certificate Details</h3>

          <div className="grid">

            <div className="box">
              <label>Certificate ID</label>
              <value>{certificate.certificateId}</value>
            </div>

            <div className="box">
              <label>Job Reference</label>
              <value>{jobId}</value>
            </div>

            <div className="box">
              <label>Status</label>
              <value className="green">
  {certificate.status}
</value>
           </div>

            <div className="box">
              <label>Algorithm</label>
              <value>{certificate.algorithm || "RSA-SHA256"}</value>
            </div>

            <div className="box">
              <label>Issue Date</label>
              <value>
  {new Date(certificate.createdAt).toLocaleString()}
</value>
            </div>

            <div className="box">
              <label>Authority</label>
              <value>TrustWipe Security Authority</value>
            </div>

          </div>
        </div>

        {/* SECTION 3 */}
        <div className="section">
          <h3>3. Device Information</h3>

          <div className="grid">

            <div className="box">
              <label>Model</label>
              <value>{certificate.deviceModel || "N/A"}</value>
            </div>

            <div className="box">
              <label>Storage Type</label>
              <value>{certificate.storageType || "N/A"}</value>
            </div>

            <div className="box">
              <label>Capacity</label>
              <value>{certificate.capacity || "N/A"}</value>
            </div>

            <div className="box">
              <label>Serial Number</label>
              <value>{certificate.serialNumber || "N/A"}</value>
            </div>

          </div>
        </div>

        {/* SECTION 4 */}
        <div className="section">
          <h3>4. Compliance Standards</h3>

          <div className="tags">
            <span>NIST SP 800-88</span>
            <span>ISO 27001</span>
            <span>GDPR</span>
            <span>HIPAA</span>
            <span>DoD 5220.22-M</span>
          </div>
        </div>

        {/* SECTION 5 */}
        <div className="section">
          <h3>5. Cryptographic Signature</h3>

          <div className="hash">
            {certificate.hash || certificate.signature || "NO_SIGNATURE"}
          </div>

          <p className="note">
            This signature ensures integrity and tamper-proof validation.
          </p>
        </div>

        {/* SIGNATURES */}
        <div className="signatures">

          <div className="sign">
            <div className="line"></div>
            <p>Chief Verification Officer</p>
            <span>TrustWipe Security Authority</span>
          </div>

          <div className="sign">
            <div className="line"></div>
            <p>Digital Validation Seal</p>
            <span>Cryptographically Verified</span>
          </div>

        </div>

        {/* FOOTER */}
        <div className="footer">
          <span>Certificate ID: {certificate.certificateId}</span>
          <span>Generated by TrustWipe System</span>
        </div>

      </div>
    </div>
  );
}

export default Certificates;