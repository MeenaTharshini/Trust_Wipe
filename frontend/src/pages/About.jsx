import {
  FiShield,
  FiTarget,
  FiEye,
  FiCpu,
  FiDatabase,
  FiLock,
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
            Building Trust in
            Secure Data Destruction
          </h1>

          <p>
            TrustWipe was created to solve one critical challenge:
            ensuring that deleted data is truly destroyed and can
            never be recovered. Our platform combines secure data
            sanitization, cryptographic verification and digital
            certification into a single trusted solution.
          </p>

        </section>

        {/* STORY */}

        <section className="about-section">

          <h2>Why TrustWipe Exists</h2>

          <p>
            Organizations regularly replace computers, storage drives,
            servers and IT assets. Simply deleting files does not
            guarantee data removal. Sensitive information can still be
            recovered using forensic tools.
          </p>

          <p>
            TrustWipe was designed to provide verifiable proof that
            data has been securely erased before devices are recycled,
            reused or decommissioned.
          </p>

        </section>

        {/* MISSION + VISION */}

        <section className="mission-grid">

          <div className="mission-card">

            <FiTarget />

            <h3>Our Mission</h3>

            <p>
              To help organizations securely destroy sensitive data
              while maintaining transparency, compliance and trust.
            </p>

          </div>

          <div className="mission-card">

            <FiEye />

            <h3>Our Vision</h3>

            <p>
              To become a trusted standard for certified data
              sanitization and verification across modern enterprises.
            </p>

          </div>

        </section>

        {/* TECHNOLOGY */}

        <section className="about-section">

          <h2>Technology Behind TrustWipe</h2>

          <div className="tech-grid">

            <div className="tech-card">
              <FiShield />
              <h3>Cryptographic Security</h3>
              <p>
                SHA-256 hashing and RSA digital signatures ensure
                certificate authenticity and integrity.
              </p>
            </div>

            <div className="tech-card">
              <FiCpu />
              <h3>Secure Wiping Engine</h3>
              <p>
                Multi-pass data sanitization designed to minimize
                recovery possibilities.
              </p>
            </div>

            <div className="tech-card">
              <FiDatabase />
              <h3>Asset Tracking</h3>
              <p>
                Centralized management of devices, wipe jobs,
                reports and certificates.
              </p>
            </div>

            <div className="tech-card">
              <FiLock />
              <h3>Public Verification</h3>
              <p>
                Certificates can be validated using unique IDs
                and cryptographic evidence.
              </p>
            </div>

          </div>

        </section>

        {/* VALUES */}

        <section className="about-section">

          <h2>Core Values</h2>

          <div className="values-grid">

            <div className="value-item">
              <FiCheckCircle />
              Transparency
            </div>

            <div className="value-item">
              <FiCheckCircle />
              Security
            </div>

            <div className="value-item">
              <FiCheckCircle />
              Compliance
            </div>

            <div className="value-item">
              <FiCheckCircle />
              Accountability
            </div>

            <div className="value-item">
              <FiCheckCircle />
              Trust
            </div>

            <div className="value-item">
              <FiCheckCircle />
              Innovation
            </div>

          </div>

        </section>

        {/* CTA */}

        <section className="about-cta">

          <h2>
            Secure Data Disposal Starts Here
          </h2>

          <p>
            TrustWipe provides organizations with secure data
            destruction, certificate generation and public
            verification in one unified platform.
          </p>

        </section>

      </div>
    </>
  );
}

export default About;