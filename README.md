# TrustWipe 🔐

### Secure Data Sanitization & Verifiable Digital Destruction Platform

**TrustWipe** is a security-focused data sanitization platform designed to provide a controlled, auditable, and cryptographically verifiable process for destroying sensitive digital data.

Unlike conventional file deletion, TrustWipe focuses on the complete lifecycle of data destruction: **sanitization → verification → integrity protection → certificate generation → auditability**.

The system combines a web platform with a Windows desktop agent to perform and monitor sanitization operations while maintaining a verifiable record of the destruction process.

---
Linkedin url: https://github.com/MeenaTharshini
Live Link: https://trust-wipe-tau.vercel.app/
## 🎯 Problem Statement

Deleting a file does not necessarily mean that its underlying data is immediately unrecoverable.

Traditional deletion mechanisms may leave recoverable remnants, metadata, temporary files, or filesystem traces. This creates a security concern when devices are:

* sold or transferred,
* reused within organizations,
* decommissioned,
* returned after temporary use,
* or disposed of.

TrustWipe addresses this problem by providing a structured sanitization workflow together with evidence that the operation was performed.

---

# 🏗️ System Architecture

TrustWipe consists of three major components:

### 1. Web Application

The web application provides:

* user authentication
* sanitization job creation
* device/job monitoring
* destruction-certificate management
* QR-based certificate verification
* audit-log access

### 2. Windows Desktop Agent

The desktop agent communicates with the web platform and performs the actual sanitization operation on the target machine.

It is responsible for:

* receiving authorized sanitization tasks
* executing the configured sanitization process
* reporting progress
* handling failures/interruption
* generating integrity information
* communicating the final result to the backend

### 3. Backend

The backend provides:

* authentication and authorization
* job management
* agent communication
* audit logging
* certificate generation
* cryptographic signing
* certificate verification

---

# 🔐 Security Architecture

Security is treated as a core design requirement rather than an additional feature.

## Authentication

TrustWipe uses **JWT-based authentication** for authenticated API access.

The token allows the backend to identify the requesting user and enforce access control on protected resources.

Role-based authorization is used to ensure that authenticated users cannot automatically perform every administrative operation.

---

# 🔑 Why SHA-256?

SHA-256 is used to generate integrity hashes for important TrustWipe records.

A hash is useful because even a small modification to the original data produces a different digest.

For example:

```text
Original Certificate
        ↓
     SHA-256
        ↓
Integrity Hash
```

The hash is not intended to encrypt the certificate.

Its purpose is to provide an **integrity fingerprint**.

If the certificate or signed data is modified later, recalculating the SHA-256 digest produces a different result.

### Important distinction

**Hashing ≠ Encryption**

SHA-256 is a one-way cryptographic hash function. It does not provide confidentiality and cannot be "decrypted" to recover the original content.

---

# ✍️ Why RSA Digital Signatures?

TrustWipe uses RSA-based digital signatures to make destruction certificates independently verifiable.

The certificate data is first hashed and then signed using the private key.

Conceptually:

```text
Certificate Data
      ↓
    SHA-256
      ↓
   Digest
      ↓
Private Key
      ↓
Digital Signature
```

A verifier can then use the corresponding public key to verify that:

1. the certificate was signed by the expected TrustWipe authority;
2. the signed data has not been modified.

The private key must remain protected and must never be exposed to clients.

---

# 🧾 Destruction Certificates

After a sanitization operation completes, TrustWipe generates a destruction certificate containing information such as:

* device/job identifier
* sanitization operation
* timestamp
* operation status
* verification information
* integrity hash
* digital signature

The certificate acts as an auditable record of the sanitization event.

---

# 📱 QR Verification

Each certificate can contain a QR code that points to its verification information.

A verifier can scan the QR code and retrieve the corresponding certificate.

The verification process checks the certificate's integrity and signature rather than simply trusting the information displayed on the certificate.

This helps prevent a modified or fabricated certificate from being treated as authentic.

---

# 🛡️ Threat Model

TrustWipe considers several possible attackers.

### Threat 1 — Certificate Modification

**Attack:**
An attacker modifies a completed certificate to change its device ID, timestamp, or sanitization status.

**Defense:**
SHA-256 integrity verification + RSA digital signature.

A modification changes the certificate digest, causing signature verification to fail.

---

### Threat 2 — Forged Certificate

**Attack:**
An attacker creates a fake destruction certificate.

**Defense:**
Certificates are digitally signed using the TrustWipe private key.

A forged certificate without a valid signature cannot pass legitimate signature verification.

---

### Threat 3 — Unauthorized API Access

**Attack:**
An attacker attempts to access protected TrustWipe endpoints without valid authentication.

**Defense:**

* JWT authentication
* protected API routes
* authorization checks
* role-based access control

---

### Threat 4 — Token Theft

**Attack:**
An attacker obtains a user's authentication token.

**Mitigation:**

* short-lived access tokens where applicable
* secure token handling
* server-side authorization checks
* HTTPS in deployment
* avoiding unnecessary exposure of credentials

JWT authentication alone does **not** eliminate token theft; therefore token lifecycle and secure storage are important parts of the deployment architecture.

---

### Threat 5 — Sanitization Interruption

**Attack / Failure:**
The sanitization process is interrupted because of power loss, process termination, hardware failure, or communication failure.

**Defense:**

The system distinguishes between:

```text
SUCCESS
FAILED
INTERRUPTED
IN_PROGRESS
```

A certificate should only indicate successful destruction when the required verification conditions have actually been satisfied.

An interrupted operation must not be falsely represented as successful.

---

### Threat 6 — Compromised Desktop Agent

The desktop agent is treated as a potentially vulnerable component.

A compromised agent could attempt to report a successful operation without actually completing sanitization.

Therefore, TrustWipe does not treat:

```text
"Agent says SUCCESS"
```

as equivalent to:

```text
"Data destruction has been independently established."
```

This distinction is important because **software-reported success is not automatically proof of physical data destruction**.

---

# 💾 Logical Deletion vs Secure Sanitization

TrustWipe distinguishes between ordinary deletion and sanitization.

### Logical deletion

A normal deletion operation may remove a filesystem reference to a file while leaving recoverable data depending on the storage technology and operating system.

### Sanitization

Sanitization attempts to make previously stored information infeasible to recover according to the selected sanitization method and the capabilities/limitations of the underlying storage technology.

TrustWipe therefore avoids making an absolute claim such as:

> "The data is mathematically guaranteed to be unrecoverable."

Instead, the system records the sanitization method and verification evidence used.

---

# ⚠️ Storage Technology Limitations

A major design consideration is that **secure deletion is not identical across all storage technologies**.

For example, SSDs use mechanisms such as:

* wear leveling
* over-provisioning
* flash translation layers

Therefore, repeatedly overwriting logical blocks does not necessarily provide the same guarantees as overwriting sectors on a traditional magnetic hard drive.

For this reason, TrustWipe's sanitization guarantees depend on:

* storage technology
* operating system
* sanitization method
* device capabilities
* verification method

For high-assurance environments, hardware-supported mechanisms such as appropriate secure-erase or cryptographic-erase capabilities may be preferable when available.

---

# 🔄 Failure Handling

TrustWipe treats failure as a first-class system state.

A sanitization job may fail because of:

* permission problems
* unavailable device
* communication failure
* unexpected process termination
* insufficient privileges
* hardware failure
* agent disconnection

The system records the operation state rather than silently treating failure as success.

Example:

```text
REQUESTED
    ↓
AUTHORIZED
    ↓
IN_PROGRESS
    ↓
 ┌───────────────┐
 ↓               ↓
SUCCESS         FAILED
 ↓
VERIFY
 ↓
SIGN
 ↓
CERTIFICATE
```

This prevents a certificate from being generated for an operation that did not actually complete successfully.

---

# 📊 Audit Logging

TrustWipe maintains an audit trail of important operations.

Examples include:

* authentication events
* job creation
* sanitization initiation
* sanitization completion
* sanitization failure
* certificate generation
* certificate verification

Audit logs provide accountability and help investigate suspicious activity.

---

# 🌐 Technology Stack

### Frontend

* React
* JavaScript / TypeScript
* modern responsive UI

### Backend

* Node.js
* Express.js
* REST APIs

### Database

* MongoDB

### Authentication

* JWT
* Role-Based Access Control

### Security

* SHA-256
* RSA digital signatures
* HTTPS in deployment

### Real-Time Communication

* Socket.IO

### Desktop

* Windows desktop sanitization agent

---

# 🧪 Security Testing

TrustWipe should be evaluated against realistic failure and attack scenarios rather than only checking whether the UI works.

The testing strategy includes:

### Authentication Testing

* invalid credentials
* expired tokens
* unauthorized API access
* privilege escalation attempts

### API Security Testing

* malformed requests
* authorization bypass attempts
* parameter manipulation
* unauthorized resource access

### Certificate Testing

* modified certificate
* modified hash
* invalid signature
* forged certificate
* expired/revoked verification information

### Agent Testing

* agent disconnect
* interrupted sanitization
* unexpected process termination
* repeated requests
* unauthorized task execution

### Integrity Testing

```text
Original certificate
       ↓
SHA-256
       ↓
Digest A

Modified certificate
       ↓
SHA-256
       ↓
Digest B
```

If:

```text
Digest A ≠ Digest B
```

the integrity check must fail.

---

# 🧠 Design Principles

TrustWipe follows several security principles:

### 1. Never trust client-side claims

A client reporting "success" should not automatically be treated as proof.

### 2. Separate integrity from confidentiality

SHA-256 provides integrity evidence; it does not encrypt information.

### 3. Separate authentication from authorization

A valid JWT identifies an authenticated user but does not automatically grant every permission.

### 4. Fail safely

An interrupted or uncertain sanitization process must not be represented as successful.

### 5. Make evidence verifiable

A destruction certificate should be independently checkable rather than relying solely on a visual document.

### 6. Explicitly state limitations

Security software should communicate what it can prove and what it cannot prove.

---

# 🚀 Future Improvements

Planned improvements include:

* hardware-aware sanitization methods
* SSD/NVMe secure-erase integration
* cryptographic erasure support
* stronger agent authentication
* certificate revocation
* tamper-evident distributed audit logs
* automated security testing
* OWASP API Security testing
* penetration testing
* forensic recovery testing
* TPM-backed key protection
* signed desktop-agent binaries
* administrator approval workflows

---

# ⚠️ Security Disclaimer

TrustWipe is an educational and research-oriented security project.

The effectiveness of data sanitization depends on the storage medium, hardware, operating system, sanitization method, permissions, and verification capabilities.

A successful software operation should not automatically be interpreted as a universal guarantee of physical data destruction.

For high-security environments, sanitization procedures should follow applicable organizational policies and recognized data-sanitization standards.

---

## 📌 Project Goal

TrustWipe aims to move beyond:

> **"I deleted the data."**

toward:

> **"I performed a defined sanitization process, recorded what happened, preserved the integrity of the evidence, and provided a mechanism to verify the resulting destruction record."**

That distinction is the core security idea behind TrustWipe.


## 🏆 Technical Achievements

* **DeepSprint Hackathon 2026 — Top 40 Finalist**, CIT Innovation Labs, Chennai Institute of Technology, as **Team Leader of Team SMIS**, presenting TrustWipe.
* **Designed and developed TrustWipe**, a security-focused data sanitization and verification platform combining a web application with a Windows desktop sanitization agent.
* **Implemented cryptographically verifiable destruction certificates** using SHA-256 integrity hashing and RSA digital signatures. - **Designed a threat model for TrustWipe** covering certificate modification, certificate forgery, unauthorized API access, token theft, sanitization interruption, and compromised desktop agents. - **Designed failure-aware sanitization workflows** that distinguish SUCCESS, FAILED, INTERRUPTED, and IN_PROGRESS states rather than treating every agent response as successful.
* **Implemented an auditable certificate-verification concept** using QR-based verification, integrity hashes, digital signatures, and audit records.
* **Designed role-based authentication and authorization architecture** using JWT-protected APIs.
* **Developed a security-focused full-stack architecture** using React, JavaScript/TypeScript, Node.js, Express.js, MongoDB, JWT, Socket.IO, SHA-256, and RSA.
* **Developed a security testing strategy** covering authentication, API security, certificate integrity, agent behavior, authorization, malformed requests, forged certificates, and interrupted sanitization.
* **Applied security-by-design principles**, including fail-safe behavior, separation of authentication and authorization, separation of integrity from confidentiality, and explicit security limitations.
* **Analyzed storage-technology limitations of secure deletion**, including SSD wear leveling, over-provisioning, and flash translation layers, rather than making unsupported claims about universal data destruction.
* **Defined an extended cybersecurity roadmap** including SSD/NVMe secure erase, cryptographic erasure, stronger agent authentication, certificate revocation, tamper-evident audit logs, OWASP API testing, penetration testing, forensic recovery testing, TPM-backed key protection, and signed desktop-agent binaries.

