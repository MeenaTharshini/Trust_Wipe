import {
  FiHardDrive,
  FiShield,
  FiFileText,
  FiDatabase,
  FiLock,
  FiCheckCircle,
  FiArrowRight,
} from "react-icons/fi";
import { Link } from "react-router-dom";

import PublicNavbar from "../components/PublicNavbar/PublicNavbar";
import "./Services.css";

function Services() {
  return (
    <>
      <PublicNavbar />

      <div className="services-page">

        {/* ================= HERO ================= */}

        <section className="services-hero">

          <div className="hero-left">

            <p className="hero-label">
              ENTERPRISE DATA SANITIZATION
            </p>

            <h1>
              Secure Data Destruction
              <br />
              for Modern Organizations
            </h1>

            <p className="hero-description">
              TrustWipe delivers enterprise-grade certified data
              sanitization, military-grade erasure, cryptographically
              signed certificates, compliance reporting and public
              verification for organizations handling sensitive
              information.
            </p>

            <div className="hero-buttons">

              <Link
                to="/register"
                className="primary-btn"
              >
                Get Started
              </Link>

              <Link
                to="/verify-certificate"
                className="secondary-btn"
              >
                Verify Certificate
              </Link>

            </div>

          </div>

          <div className="hero-right">

            <div className="security-card">

              <FiShield />

              <h2>Enterprise Security</h2>

              <p>
                Trusted Data Sanitization Platform
              </p>

              <div className="security-stats">

                <div>
                  <h3>99.99%</h3>
                  <span>Success Rate</span>
                </div>

                <div>
                  <h3>256-bit</h3>
                  <span>Encryption</span>
                </div>

              </div>

            </div>

          </div>

        </section>

        {/* ================= SERVICES ================= */}

        <section className="section">

          <div className="section-title">

            <p>OUR SERVICES</p>

            <h2>
              Everything Required for
              <br />
              Secure Data Destruction
            </h2>

          </div>

          <div className="services-grid">

            <div className="service-card">

              <FiHardDrive />

              <h3>Secure Device Wiping</h3>

              <p>
                Certified sanitization for HDDs, SSDs,
                USB drives and enterprise storage using
                approved overwrite algorithms.
              </p>

            </div>

            <div className="service-card">

              <FiShield />

              <h3>Military Grade Erasure</h3>

              <p>
                Multi-pass overwrite techniques and
                secure erase procedures ensuring
                irreversible destruction.
              </p>

            </div>

            <div className="service-card">

              <FiFileText />

              <h3>Digital Certificates</h3>

              <p>
                Automatically generate digitally signed
                destruction certificates with QR-based
                public verification.
              </p>

            </div>

            <div className="service-card">

              <FiDatabase />

              <h3>Asset Management</h3>

              <p>
                Maintain centralized records for storage
                devices, serial numbers, wipe history
                and certificates.
              </p>

            </div>

            <div className="service-card">

              <FiLock />

              <h3>Compliance Reporting</h3>

              <p>
                Generate audit-ready compliance reports
                for GDPR, ISO, HIPAA and enterprise
                security standards.
              </p>

            </div>

            <div className="service-card">

              <FiCheckCircle />

              <h3>Public Verification</h3>

              <p>
                Verify destruction certificates through
                secure online validation and digital
                signature verification.
              </p>

            </div>

          </div>

        </section>

        {/* ================= WHY TRUSTWIPE ================= */}

        <section className="section">

          <div className="section-title">

            <p>WHY TRUSTWIPE</p>

            <h2>
              Trusted by Modern Enterprises
            </h2>

          </div>

          <div className="stats-grid">

            <div className="stat-card">
              <h2>5000+</h2>
              <span>Devices Sanitized</span>
            </div>

            <div className="stat-card">
              <h2>100%</h2>
              <span>Certificate Integrity</span>
            </div>

            <div className="stat-card">
              <h2>24/7</h2>
              <span>Verification Portal</span>
            </div>

            <div className="stat-card">
              <h2>256-bit</h2>
              <span>Digital Security</span>
            </div>

          </div>

        </section>

        {/* ================= WORKFLOW ================= */}

        <section className="section">

          <div className="section-title">

            <p>WORKFLOW</p>

            <h2>
              How TrustWipe Works
            </h2>

          </div>

          <div className="workflow-grid">

            <div className="workflow-card">

              <div className="step-number">
                01
              </div>

              <h3>Register Device</h3>

              <p>
                Add storage devices with complete
                identification and inventory details.
              </p>

            </div>

            <div className="workflow-card">

              <div className="step-number">
                02
              </div>

              <h3>Perform Secure Wipe</h3>

              <p>
                Execute enterprise-certified wipe
                algorithms with complete monitoring.
              </p>

            </div>

            <div className="workflow-card">

              <div className="step-number">
                03
              </div>

              <h3>Generate Certificate</h3>

              <p>
                Produce digitally signed proof of
                destruction with cryptographic hash.
              </p>

            </div>

            <div className="workflow-card">

              <div className="step-number">
                04
              </div>

              <h3>Public Verification</h3>

              <p>
                Anyone can verify authenticity using
                the certificate ID and QR code.
              </p>

            </div>

          </div>

        </section>

        {/* ================= COMPLIANCE ================= */}

        <section className="section">

          <div className="section-title">

            <p>COMPLIANCE</p>

            <h2>
              Standards We Support
            </h2>

          </div>

          <div className="compliance-grid">

            <div className="compliance-card">
              GDPR
            </div>

            <div className="compliance-card">
              NIST 800-88
            </div>

            <div className="compliance-card">
              ISO 27001
            </div>

            <div className="compliance-card">
              DoD 5220.22-M
            </div>

            <div className="compliance-card">
              HIPAA
            </div>

            <div className="compliance-card">
              PCI DSS
            </div>

          </div>

        </section>

        {/* ================= CTA ================= */}

        <section className="cta-section">

          <h2>
            Ready to Secure Your Data?
          </h2>

          <p>
            Start using TrustWipe today and generate
            enterprise-grade certified data destruction
            reports with complete transparency.
          </p>

          <div className="hero-buttons">

            <Link
              to="/register"
              className="primary-btn"
            >
              Create Account
            </Link>

            <Link
              to="/login"
              className="secondary-btn"
            >
              Login
              <FiArrowRight />
            </Link>

          </div>

        </section>

      </div>
    </>
  );
}

export default Services;