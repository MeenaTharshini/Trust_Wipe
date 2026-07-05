import {
  FiShield,
  FiLock,
  FiCpu,
  FiDatabase,
  FiAward,
  FiCheckCircle,
} from "react-icons/fi";

import PublicNavbar from "../components/PublicNavbar/PublicNavbar";
import "./About.css";

function About() {
  return (
    <>
      <PublicNavbar />

      <div className="about-page">

        {/* HERO */}

        <section className="about-hero">

          <span className="about-tag">
            ABOUT TRUSTWIPE
          </span>

          <h1>
            Enterprise Data Destruction &
            Certificate Verification Platform
          </h1>

          <p>
            TrustWipe is a secure enterprise solution designed to
            permanently erase sensitive data, generate digitally signed
            destruction certificates, and provide public certificate
            verification through cryptographic validation.
          </p>

        </section>

        {/* MISSION */}

        <section className="about-section">

          <h2>Our Mission</h2>

          <p>
            Organizations store enormous amounts of confidential data.
            Simply deleting files is not enough. TrustWipe ensures every
            storage device is securely sanitized using industry-approved
            techniques, preventing unauthorized data recovery while
            maintaining complete auditability.
          </p>

        </section>

        {/* FEATURES */}

        <section className="feature-grid">

          <div className="feature-card">

            <FiShield />

            <h3>Enterprise Security</h3>

            <p>
              Built with strong authentication, digital signatures and
              cryptographic verification to protect every certificate.
            </p>

          </div>

          <div className="feature-card">

            <FiCpu />

            <h3>Advanced Wiping Engine</h3>

            <p>
              Securely erase HDDs, SSDs, USB drives and enterprise
              storage devices using trusted sanitization methods.
            </p>

          </div>

          <div className="feature-card">

            <FiDatabase />

            <h3>Asset Tracking</h3>

            <p>
              Monitor every registered device, wipe operation and
              certificate from one centralized dashboard.
            </p>

          </div>

          <div className="feature-card">

            <FiLock />

            <h3>Public Verification</h3>

            <p>
              Anyone can validate certificate authenticity using the
              unique Certificate ID and cryptographic signature.
            </p>

          </div>

        </section>

        {/* WHY TRUSTWIPE */}

        <section className="about-section">

          <h2>Why Choose TrustWipe?</h2>

          <div className="why-grid">

            <div className="why-item">
              <FiCheckCircle />
              <span>Digitally Signed Certificates</span>
            </div>

            <div className="why-item">
              <FiCheckCircle />
              <span>Cryptographic SHA Verification</span>
            </div>

            <div className="why-item">
              <FiCheckCircle />
              <span>Enterprise Dashboard</span>
            </div>

            <div className="why-item">
              <FiCheckCircle />
              <span>Device Lifecycle Management</span>
            </div>

            <div className="why-item">
              <FiCheckCircle />
              <span>Secure Wipe Reporting</span>
            </div>

            <div className="why-item">
              <FiCheckCircle />
              <span>Audit Ready Documentation</span>
            </div>

          </div>

        </section>

        {/* COMPLIANCE */}

        <section className="compliance">

          <FiAward className="award-icon" />

          <h2>Built for Enterprise Compliance</h2>

          <p>
            TrustWipe helps organizations maintain secure data disposal
            practices with complete traceability, certificate generation,
            verification and reporting suitable for enterprise and
            regulatory audit requirements.
          </p>

        </section>

        {/* FOOTER */}

        <footer className="about-footer">

          <h3>TrustWipe</h3>

          <p>
            Enterprise Data Destruction Platform
          </p>

          <span>
            © 2026 TrustWipe. All Rights Reserved.
          </span>

        </footer>

      </div>
    </>
  );
}

export default About;