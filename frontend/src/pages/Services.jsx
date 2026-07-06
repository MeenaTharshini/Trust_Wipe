import {
  FiHardDrive,
  FiShield,
  FiFileText,
  FiDatabase,
  FiLock,
  FiCheckCircle,
  FiArrowRight,
  FiSearch,
  FiCpu,
} from "react-icons/fi";

import { Link } from "react-router-dom";
import PublicNavbar from "../components/PublicNavbar/PublicNavbar";

import "./Services.css";

// Reusable card component
function ServiceCard({ icon: Icon, title, description }) {
  return (
    <div className="service-card">
      <Icon />
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Services() {
  const services = [
    {
      icon: FiHardDrive,
      title: "Device Registration",
      description:
        "Register storage devices with identification, serial numbers, capacity and location details.",
    },
    {
      icon: FiShield,
      title: "Secure Data Wiping",
      description:
        "Perform controlled wipe operations to sanitize storage media before disposal or reuse.",
    },
    {
      icon: FiFileText,
      title: "Certificate Generation",
      description:
        "Generate digital certificates after successful wipe completion.",
    },
    {
      icon: FiDatabase,
      title: "Asset Management",
      description:
        "Maintain centralized records of devices, wipe jobs and generated certificates.",
    },
    {
      icon: FiLock,
      title: "Cryptographic Security",
      description:
        "Protect verification data using SHA hashing and RSA-based digital signatures.",
    },
    {
      icon: FiSearch,
      title: "Certificate Verification",
      description:
        "Validate certificate authenticity through the public verification portal.",
    },
  ];

  const benefits = [
    {
      icon: FiCheckCircle,
      title: "Transparency",
      description: "Every wipe activity is tracked and documented.",
    },
    {
      icon: FiDatabase,
      title: "Centralized Records",
      description: "Manage devices, jobs and certificates in one place.",
    },
    {
      icon: FiLock,
      title: "Integrity Protection",
      description: "Verification records are protected using cryptographic methods.",
    },
    {
      icon: FiCpu,
      title: "Simplified Workflow",
      description: "Register, wipe, verify and certify devices efficiently.",
    },
  ];

  const workflow = [
    { step: "01", title: "Register Device", description: "Add device information and inventory details." },
    { step: "02", title: "Perform Wipe", description: "Execute secure data sanitization operations." },
    { step: "03", title: "Verify Results", description: "Validate wipe completion using verification tools." },
    { step: "04", title: "Generate Certificate", description: "Produce digital proof of data destruction." },
  ];

  const technologies = [
    "SHA-256 Hashing",
    "RSA Signatures",
    "Secure Wiping",
    "Verification Engine",
    "Asset Tracking",
    "Certificate Generation",
  ];

  return (
    <>
      <PublicNavbar />

      <div className="services-page">
        {/* HERO */}
        <section className="services-hero">
          <div className="hero-left">
            <p className="hero-label">TRUSTWIPE SERVICES</p>
            <h1>
              Complete Data <br />
              Sanitization & <br />
              Verification Platform
            </h1>
            <p className="hero-description">
              TrustWipe provides secure device wiping, certificate generation, verification,
              asset management and compliance-ready reporting through a unified platform.
            </p>
            <div className="hero-buttons">
              <Link to="/register" className="primary-btn">Get Started</Link>
              <Link to="/verify" className="secondary-btn">Verify Certificate</Link>
            </div>
          </div>

          <div className="hero-right">
  <div className="security-card">
    <FiShield className="security-logo" />
    <h2>TrustWipe Platform</h2>
    <p className="security-subtitle">Secure • Verifiable • Centralized</p>

    <div className="security-features">
      <div className="feature-item">
        <FiCheckCircle className="feature-icon" />
        <span>Device Tracking</span>
      </div>
      <div className="feature-item">
        <FiLock className="feature-icon" />
        <span>Digital Signatures</span>
      </div>
      <div className="feature-item">
        <FiFileText className="feature-icon" />
        <span>Certificates</span>
      </div>
      <div className="feature-item">
        <FiSearch className="feature-icon" />
        <span>Verification Portal</span>
      </div>
    </div>
  </div>
</div>

        </section>

        {/* SERVICES */}
        <section className="section">
          <div className="section-title">
            <p>OUR SERVICES</p>
            <h2>Everything Needed for Secure Data Disposal</h2>
          </div>
          <div className="services-grid">
            {services.map((s, i) => (
              <ServiceCard key={i} icon={s.icon} title={s.title} description={s.description} />
            ))}
          </div>
        </section>

        {/* PLATFORM BENEFITS */}
        <section className="section">
          <div className="section-title">
            <p>PLATFORM BENEFITS</p>
            <h2>Why Use TrustWipe</h2>
          </div>
          <div className="services-grid">
            {benefits.map((b, i) => (
              <ServiceCard key={i} icon={b.icon} title={b.title} description={b.description} />
            ))}
          </div>
        </section>

        {/* WORKFLOW */}
        <section className="section">
          <div className="section-title">
            <p>WORKFLOW</p>
            <h2>How TrustWipe Works</h2>
          </div>
          <div className="workflow-grid">
            {workflow.map((w, i) => (
              <div key={i} className="workflow-card">
                <div className="step-number">{w.step}</div>
                <h3>{w.title}</h3>
                <p>{w.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* TECHNOLOGY */}
        <section className="section">
          <div className="section-title">
            <p>TECHNOLOGY</p>
            <h2>Core Technologies</h2>
          </div>
          <div className="compliance-grid">
            {technologies.map((t, i) => (
              <div key={i} className="compliance-card">{t}</div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="cta-section">
          <h2>Secure Your Data Lifecycle</h2>
          <p>
            Manage device sanitization, verification and certification through a single trusted platform.
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="primary-btn">Create Account</Link>
            <Link to="/login" className="secondary-btn">
              Login <FiArrowRight />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}

export default Services;
