import {
  FiShield,
  FiHardDrive,
  FiFileText,
  FiLock,
  FiArrowRight,
  FiAlertTriangle,
  FiCheckCircle,
  FiDatabase,
  FiCpu,
} from "react-icons/fi";

import { Link } from "react-router-dom";
import PublicNavbar from "../components/PublicNavbar/PublicNavbar";

import "./Home.css";

function Home() {
  return (
    <>
      <PublicNavbar />

      <div className="home-page">

        {/* HERO */}

        <section className="home-hero">

          <div className="hero-left">

            <p className="hero-badge">
              SECURE DATA SANITIZATION PLATFORM
            </p>

            <h1>
              Secure Data Wiping
              <br />
              & Certificate
              <br />
              Verification
            </h1>

            <p className="hero-text">
              TrustWipe helps organizations securely erase
              sensitive information from storage devices,
              generate cryptographically signed certificates,
              and verify data destruction with confidence.
            </p>

            <div className="hero-actions">

              <Link
                to="/register"
                className="primary-btn"
              >
                Get Started
              </Link>

              <Link
                to="/services"
                className="secondary-btn"
              >
                Explore Services
                <FiArrowRight />
              </Link>

            </div>

          </div>

          <div className="hero-card">

            <FiShield />

            <h2>TrustWipe Security</h2>

            <p>
              Combining secure wiping,
              cryptographic verification,
              and digital certification.
            </p>

            <div className="hero-stats">

              <div>
                <h3>SHA-256</h3>
                <span>Hashing</span>
              </div>

              <div>
                <h3>RSA</h3>
                <span>Signatures</span>
              </div>

              <div>
                <h3>QR</h3>
                <span>Verification</span>
              </div>

              <div>
                <h3>PDF</h3>
                <span>Certificates</span>
              </div>

            </div>

          </div>

        </section>

        {/* PROBLEM */}

        <section className="problem-section">

          <FiAlertTriangle />

          <h2>
            Why Simple File Deletion Is Not Enough
          </h2>

          <p>
            Deleting files or formatting a drive does not
            permanently remove data. Recovery software can
            often retrieve information unless proper data
            sanitization methods are used.
          </p>

        </section>

        {/* FEATURES */}

        <div className="section-title">
          <p>FEATURES</p>
          <h2>Everything Needed For Secure Data Disposal</h2>
        </div>

        <section className="feature-grid">

          <div className="feature-card">
            <FiHardDrive />
            <h3>Secure Device Wiping</h3>
            <p>
              Perform secure data sanitization on storage
              devices before reuse or disposal.
            </p>
          </div>

          <div className="feature-card">
            <FiShield />
            <h3>Verification Engine</h3>
            <p>
              Verify wipe operations using cryptographic
              evidence and integrity checks.
            </p>
          </div>

          <div className="feature-card">
            <FiFileText />
            <h3>Digital Certificates</h3>
            <p>
              Generate digitally signed certificates as
              proof of secure data destruction.
            </p>
          </div>

          <div className="feature-card">
            <FiDatabase />
            <h3>Asset Tracking</h3>
            <p>
              Manage devices, wipe jobs,
              certificates and reports centrally.
            </p>
          </div>

          <div className="feature-card">
            <FiLock />
            <h3>RSA Security</h3>
            <p>
              Protect certificate authenticity using
              public-key cryptography.
            </p>
          </div>

          <div className="feature-card">
            <FiCheckCircle />
            <h3>Compliance Ready</h3>
            <p>
              Maintain documentation and records for
              audits and compliance reporting.
            </p>
          </div>

        </section>

        {/* TECHNOLOGY */}

        <div className="section-title">
          <p>TECHNOLOGY</p>
          <h2>Built With Trusted Security Standards</h2>
        </div>

        <section className="feature-grid">

          <div className="feature-card">
            <FiShield />
            <h3>SHA-256 Hashing</h3>
            <p>
              Ensures certificate integrity and
              prevents tampering.
            </p>
          </div>

          <div className="feature-card">
            <FiLock />
            <h3>RSA Digital Signatures</h3>
            <p>
              Provides authenticity verification
              for generated certificates.
            </p>
          </div>

          <div className="feature-card">
            <FiCpu />
            <h3>Verification Module</h3>
            <p>
              Validates certificate information
              and digital signatures.
            </p>
          </div>

          <div className="feature-card">
            <FiFileText />
            <h3>PDF Certificates</h3>
            <p>
              Generates professional proof-of-destruction
              reports and certificates.
            </p>
          </div>

        </section>

        {/* WORKFLOW */}

        <div className="section-title">
          <p>WORKFLOW</p>
          <h2>How TrustWipe Works</h2>
        </div>

        <section className="why-grid">

          <div className="why-card">
            <h3>01</h3>
            <p>
              Register storage devices and asset details.
            </p>
          </div>

          <div className="why-card">
            <h3>02</h3>
            <p>
              Execute secure wipe operations.
            </p>
          </div>

          <div className="why-card">
            <h3>03</h3>
            <p>
              Verify operation integrity and results.
            </p>
          </div>

          <div className="why-card">
            <h3>04</h3>
            <p>
              Generate and validate destruction certificates.
            </p>
          </div>

        </section>

        {/* COMPLIANCE */}

        <div className="section-title">
          <p>SUPPORTED STANDARDS</p>
          <h2>Designed Around Industry Practices</h2>
        </div>

        <section className="stats-grid">

          <div className="stat-card">
            <h2>NIST</h2>
            <span>800-88 Guidelines</span>
          </div>

          <div className="stat-card">
            <h2>ISO</h2>
            <span>27001 Security</span>
          </div>

          <div className="stat-card">
            <h2>RSA</h2>
            <span>Digital Signatures</span>
          </div>

          <div className="stat-card">
            <h2>SHA</h2>
            <span>Integrity Verification</span>
          </div>

        </section>

        {/* CTA */}

        <section className="home-cta">

          <h2>
            Secure Data Disposal Starts Here
          </h2>

          <p>
            Manage devices, perform secure wiping,
            generate certificates and verify
            destruction records in one platform.
          </p>

          <div className="hero-actions">

            <Link
              to="/register"
              className="primary-btn"
            >
              Create Account
            </Link>

            <Link
              to="/verify"
              className="secondary-btn"
            >
              Verify Certificate
            </Link>

          </div>

        </section>

      </div>
    </>
  );
}

export default Home;