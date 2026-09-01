import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export default function generateComplianceReport(data = {}) {
  const {
    devices = [],
    certificates = [],
    auditLogs = [],
    generatedBy = "TrustWipe Enterprise",
  } = data;

  const doc = new jsPDF("p", "mm", "a4");

  const PAGE_WIDTH = doc.internal.pageSize.getWidth();
  const PAGE_HEIGHT = doc.internal.pageSize.getHeight();

  // -------------------------------------------------
  // COLORS
  // -------------------------------------------------
  const PRIMARY = [0, 180, 255];
  const DARK = [32, 41, 56];
  const SUCCESS = [22, 163, 74];
  const WARNING = [245, 158, 11];
  const DANGER = [220, 38, 38];
  const MUTED = [100, 116, 139];
  const LIGHT = [248, 250, 252];
  const BORDER = [226, 232, 240];

  // -------------------------------------------------
  // BASIC HELPERS
  // -------------------------------------------------

  const safeArray = (value) => (Array.isArray(value) ? value : []);

  const deviceList = safeArray(devices);
  const certificateList = safeArray(certificates);
  const auditLogList = safeArray(auditLogs);

  const now = new Date();

  const generatedAt = now.toLocaleString();

  const reportId =
    `TWR-CMP-${now.getFullYear()}-` +
    `${String(now.getMonth() + 1).padStart(2, "0")}` +
    `${String(now.getDate()).padStart(2, "0")}-` +
    `${String(now.getHours()).padStart(2, "0")}` +
    `${String(now.getMinutes()).padStart(2, "0")}` +
    `${String(now.getSeconds()).padStart(2, "0")}`;

  // -------------------------------------------------
  // NORMALIZE VALUES
  // -------------------------------------------------

  const normalize = (value) =>
    String(value ?? "")
      .trim()
      .toLowerCase();

  const isCompleted = (device) => {
    const status = normalize(device.status);

    return (
      status === "completed" ||
      status === "complete" ||
      status === "sanitized" ||
      status === "sanitization completed"
    );
  };

  const isVerified = (device) => {
    const status = normalize(
      device.verificationStatus ||
        device.verification ||
        device.verificationResult
    );

    return (
      status === "verified" ||
      status === "passed" ||
      status === "pass" ||
      status === "successful" ||
      status === "success"
    );
  };

  const hasDeviceIdentity = (device) => {
    return Boolean(
      device.deviceName ||
        device.name ||
        device.deviceId
    ) &&
      Boolean(
        device.serialNumber ||
          device.serial ||
          device.serialNo
      ) &&
      Boolean(
        device.capacity ||
          device.size ||
          device.storageCapacity
      );
  };

  const hasEvidenceHash = (device) => {
    return Boolean(
      device.evidenceHash ||
        device.sha256 ||
        device.hash
    );
  };

  const getCertificateDeviceId = (certificate) => {
    return (
      certificate.deviceId ||
      certificate.deviceID ||
      certificate.serialNumber ||
      certificate.serial ||
      certificate.deviceSerial ||
      null
    );
  };

  const getDeviceIdentifier = (device) => {
    return (
      device.deviceId ||
      device.deviceID ||
      device.serialNumber ||
      device.serial ||
      null
    );
  };

  const certificateExistsForDevice = (device) => {
    const deviceId = getDeviceIdentifier(device);

    if (!deviceId) return false;

    return certificateList.some((certificate) => {
      const certificateDeviceId =
        getCertificateDeviceId(certificate);

      return (
        certificateDeviceId &&
        String(certificateDeviceId) === String(deviceId)
      );
    });
  };

  // -------------------------------------------------
  // COUNTS
  // -------------------------------------------------

  const total = deviceList.length;

  const completedDevices =
    deviceList.filter(isCompleted);

  const verifiedDevices =
    deviceList.filter(isVerified);

  const identifiedDevices =
    deviceList.filter(hasDeviceIdentity);

  const evidenceDevices =
    deviceList.filter(hasEvidenceHash);

  const certificateCoveredDevices =
    deviceList.filter(certificateExistsForDevice);

  const pending = deviceList.filter(
    (device) => normalize(device.status) === "pending"
  ).length;

  const wiping = deviceList.filter(
    (device) =>
      normalize(device.status) === "wiping" ||
      normalize(device.status) === "running" ||
      normalize(device.status) === "in progress"
  ).length;

  const failed = deviceList.filter(
    (device) =>
      normalize(device.status) === "failed" ||
      normalize(device.status) === "error" ||
      normalize(device.status) === "interrupted"
  ).length;

  // -------------------------------------------------
  // COVERAGE CALCULATIONS
  // -------------------------------------------------

  const sanitizationCompletion =
    total === 0
      ? 0
      : Math.round((completedDevices.length / total) * 100);

  const verificationCoverage =
    total === 0
      ? 0
      : Math.round((verifiedDevices.length / total) * 100);

  const certificateCoverage =
    total === 0
      ? 0
      : Math.round((certificateCoveredDevices.length / total) * 100);

  const deviceIdentificationCoverage =
    total === 0
      ? 0
      : Math.round((identifiedDevices.length / total) * 100);

  const evidenceCoverage =
    total === 0
      ? 0
      : Math.round((evidenceDevices.length / total) * 100);

  const auditCoverage =
    total === 0
      ? 0
      : auditLogList.length > 0
        ? 100
        : 0;

  // -------------------------------------------------
  // ASSESSMENT HELPERS
  // -------------------------------------------------

  const getStatus = (condition, hasData = true) => {
    if (!hasData) return "NOT ASSESSED";
    return condition ? "PASS" : "REVIEW";
  };

  const overallPassed =
    total > 0 &&
    sanitizationCompletion === 100 &&
    verificationCoverage === 100 &&
    certificateCoverage === 100 &&
    deviceIdentificationCoverage === 100 &&
    evidenceCoverage === 100;

  const overallAssessment =
    total === 0
      ? "NO DATA"
      : overallPassed
        ? "PASSED"
        : "REVIEW REQUIRED";

  // -------------------------------------------------
  // SECTION TITLE
  // -------------------------------------------------

  function addSectionTitle(text, y) {
    doc.setTextColor(...DARK);
    doc.setFontSize(17);
    doc.setFont("helvetica", "bold");
    doc.text(text, 15, y);

    return y + 8;
  }

  // -------------------------------------------------
  // PAGE BREAK HELPER
  // -------------------------------------------------

  function ensureSpace(y, requiredHeight = 35) {
    if (y + requiredHeight > PAGE_HEIGHT - 25) {
      doc.addPage();
      return 25;
    }

    return y;
  }

  // -------------------------------------------------
  // TABLE Y HELPER
  // -------------------------------------------------

  function nextY(defaultY = 42) {
    return doc.lastAutoTable
      ? doc.lastAutoTable.finalY + 15
      : defaultY;
  }

  // -------------------------------------------------
  // HEADER
  // -------------------------------------------------

  doc.setFillColor(...PRIMARY);
  doc.rect(0, 0, PAGE_WIDTH, 28, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(23);
  doc.text("TrustWipe Enterprise", 15, 15);

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(
    "Sanitization Assessment & Audit Report",
    15,
    22
  );

  // -------------------------------------------------
  // REPORT INFORMATION
  // -------------------------------------------------

  let y = 42;

  doc.setTextColor(...DARK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("Sanitization Assessment", 15, y);

  y += 9;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  doc.text(`Report ID : ${reportId}`, 15, y);

  y += 6;

  doc.text(`Generated : ${generatedAt}`, 15, y);

  y += 6;

  doc.text(`Generated By : ${generatedBy}`, 15, y);

  // -------------------------------------------------
  // EXECUTIVE SUMMARY
  // -------------------------------------------------

  y = addSectionTitle(
    "Executive Summary",
    y + 15
  );

  autoTable(doc, {
    startY: y,

    head: [["Metric", "Result", "Coverage"]],

    body: [
      [
        "Total Assets",
        total,
        total > 0 ? "100%" : "0%",
      ],
      [
        "Sanitization Completed",
        completedDevices.length,
        `${sanitizationCompletion}%`,
      ],
      [
        "Verification Successful",
        verifiedDevices.length,
        `${verificationCoverage}%`,
      ],
      [
        "Certificates Generated",
        certificateList.length,
        `${certificateCoverage}%`,
      ],
      [
        "Device Identification",
        identifiedDevices.length,
        `${deviceIdentificationCoverage}%`,
      ],
      [
        "Cryptographic Evidence",
        evidenceDevices.length,
        `${evidenceCoverage}%`,
      ],
      [
        "Audit Records",
        auditLogList.length,
        auditLogList.length > 0
          ? "AVAILABLE"
          : "NOT AVAILABLE",
      ],
    ],

    headStyles: {
      fillColor: PRIMARY,
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },

    alternateRowStyles: {
      fillColor: LIGHT,
    },

    theme: "grid",

    styles: {
      fontSize: 9,
      cellPadding: 3,
    },

    margin: {
      top: 40,
      bottom: 30,
    },

    pageBreak: "auto",
  });

  // -------------------------------------------------
  // OVERALL ASSESSMENT
  // -------------------------------------------------

  y = nextY();

  y = ensureSpace(y, 35);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(...DARK);

  doc.text("Overall Assessment", 15, y);

  y += 9;

  const assessmentColor =
    overallAssessment === "PASSED"
      ? SUCCESS
      : overallAssessment === "NO DATA"
        ? MUTED
        : WARNING;

  doc.setFillColor(...assessmentColor);
  doc.roundedRect(
    15,
    y - 5,
    65,
    12,
    2,
    2,
    "F"
  );

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");

  doc.text(
    overallAssessment,
    47.5,
    y + 3,
    { align: "center" }
  );

  y += 17;

  doc.setTextColor(...MUTED);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");

  doc.text(
    "This status reflects TrustWipe's recorded sanitization,",
    15,
    y
  );

  doc.text(
    "verification, evidence, certificate, and audit controls.",
    15,
    y + 5
  );

  // -------------------------------------------------
  // CONTROL ASSESSMENT
  // -------------------------------------------------

  y = addSectionTitle(
    "TrustWipe Control Assessment",
    y + 18
  );

  autoTable(doc, {
    startY: y,

    head: [
      ["Control", "Status", "Evidence / Basis"],
    ],

    body: [
      [
        "Device Identification",
        getStatus(
          deviceIdentificationCoverage === 100,
          total > 0
        ),
        total > 0
          ? `${identifiedDevices.length}/${total} assets have device identity information.`
          : "No device records available.",
      ],

      [
        "Sanitization Execution",
        getStatus(
          sanitizationCompletion === 100,
          total > 0
        ),
        total > 0
          ? `${completedDevices.length}/${total} sanitization operations completed.`
          : "No sanitization records available.",
      ],

      [
        "Post-Operation Verification",
        getStatus(
          verificationCoverage === 100,
          total > 0
        ),
        total > 0
          ? `${verifiedDevices.length}/${total} assets have successful verification status.`
          : "No verification records available.",
      ],

      [
        "Cryptographic Evidence",
        getStatus(
          evidenceCoverage === 100,
          total > 0
        ),
        total > 0
          ? `${evidenceDevices.length}/${total} assets contain an evidence hash.`
          : "No evidence records available.",
      ],

      [
        "Certificate Coverage",
        getStatus(
          certificateCoverage === 100,
          total > 0
        ),
        total > 0
          ? `${certificateCoveredDevices.length}/${total} assets are linked to certificates.`
          : "No certificate-linked assets available.",
      ],

      [
        "Audit Records",
        getStatus(
          auditLogList.length > 0,
          true
        ),
        auditLogList.length > 0
          ? `${auditLogList.length} audit event(s) recorded.`
          : "No audit log data was supplied to the report.",
      ],
    ],

    headStyles: {
      fillColor: SUCCESS,
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },

    alternateRowStyles: {
      fillColor: LIGHT,
    },

    theme: "grid",

    styles: {
      fontSize: 8.5,
      cellPadding: 3,
    },

    columnStyles: {
      0: { cellWidth: 45 },
      1: { cellWidth: 30 },
      2: { cellWidth: 105 },
    },

    margin: {
      top: 40,
      bottom: 30,
    },

    pageBreak: "auto",
  });

  // -------------------------------------------------
  // STANDARDS / REFERENCE FRAMEWORK
  // -------------------------------------------------

  y = addSectionTitle(
    "Reference Frameworks",
    nextY()
  );

  autoTable(doc, {
    startY: y,

    head: [
      ["Framework / Regulation", "Assessment", "Scope"],
    ],

    body: [
      [
        "NIST SP 800-88 Rev.2",
        "REFERENCE",
        "Media sanitization guidance",
      ],
      [
        "ISO/IEC 27001",
        "NOT ASSESSED",
        "Information security management system",
      ],
      [
        "GDPR Article 17",
        "NOT ASSESSED",
        "Right to erasure / organizational obligations",
      ],
      [
        "HIPAA",
        "NOT ASSESSED",
        "Healthcare privacy and security obligations",
      ],
    ],

    headStyles: {
      fillColor: PRIMARY,
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },

    alternateRowStyles: {
      fillColor: LIGHT,
    },

    theme: "grid",

    styles: {
      fontSize: 8.5,
      cellPadding: 3,
    },

    margin: {
      top: 40,
      bottom: 30,
    },

    pageBreak: "auto",
  });

  // -------------------------------------------------
  // ASSESSMENT NOTE
  // -------------------------------------------------

  y = nextY();

  y = ensureSpace(y, 30);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...DARK);

  doc.text(
    "Important Assessment Note",
    15,
    y
  );

  y += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...MUTED);

  const note =
    "TrustWipe records operational controls and evidence that may support " +
    "organizational compliance and audit activities. A successful TrustWipe " +
    "assessment does not by itself constitute independent certification or " +
    "legal compliance with ISO 27001, GDPR, HIPAA, or other regulations.";

  const noteLines = doc.splitTextToSize(
    note,
    PAGE_WIDTH - 30
  );

  doc.text(noteLines, 15, y);

  // -------------------------------------------------
  // ASSET INVENTORY
  // -------------------------------------------------

  y += noteLines.length * 4 + 12;

  y = addSectionTitle(
    "Asset Inventory",
    y
  );

  const assetRows =
    deviceList.length > 0
      ? deviceList.map((device) => {
          const operationStatus =
            device.status || "Unknown";

          const verificationStatus =
            device.verificationStatus ||
            device.verification ||
            "Not Assessed";

          return [
            device.deviceName ||
              device.name ||
              device.deviceId ||
              "Unknown",

            device.serialNumber ||
              device.serial ||
              "N/A",

            device.storageType ||
              device.mediaType ||
              "N/A",

            device.capacity ||
              device.storageCapacity ||
              device.size ||
              "N/A",

            operationStatus,

            verificationStatus,
          ];
        })
      : [
          [
            "No assets",
            "N/A",
            "N/A",
            "N/A",
            "N/A",
            "N/A",
          ],
        ];

  autoTable(doc, {
    startY: y,

    head: [
      [
        "Device",
        "Serial",
        "Media",
        "Capacity",
        "Operation",
        "Verification",
      ],
    ],

    body: assetRows,

    headStyles: {
      fillColor: PRIMARY,
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },

    alternateRowStyles: {
      fillColor: LIGHT,
    },

    theme: "grid",

    styles: {
      fontSize: 7.5,
      cellPadding: 2.5,
    },

    margin: {
      top: 40,
      bottom: 30,
    },

    pageBreak: "auto",
  });

  // -------------------------------------------------
  // RISK ASSESSMENT
  // -------------------------------------------------

  y = addSectionTitle(
    "Risk Assessment",
    nextY()
  );

  const riskRows = [
    [
      "Pending Devices",
      pending > 0 ? "MEDIUM" : "NONE",
      pending > 0
        ? `${pending} device(s) still require sanitization.`
        : "No pending devices.",
    ],

    [
      "Running Operations",
      wiping > 0 ? "LOW" : "NONE",
      wiping > 0
        ? `${wiping} operation(s) are currently running.`
        : "No running operations.",
    ],

    [
      "Failed / Interrupted",
      failed > 0 ? "HIGH" : "NONE",
      failed > 0
        ? `${failed} operation(s) require investigation.`
        : "No failed or interrupted operations.",
    ],

    [
      "Unverified Assets",
      total - verifiedDevices.length > 0
        ? "MEDIUM"
        : "NONE",
      total - verifiedDevices.length > 0
        ? `${total - verifiedDevices.length} asset(s) lack successful verification.`
        : "All assets have successful verification.",
    ],

    [
      "Missing Evidence",
      total - evidenceDevices.length > 0
        ? "MEDIUM"
        : "NONE",
      total - evidenceDevices.length > 0
        ? `${total - evidenceDevices.length} asset(s) lack cryptographic evidence.`
        : "Evidence available for all assets.",
    ],
  ];

  autoTable(doc, {
    startY: y,

    head: [
      ["Risk Area", "Severity", "Recommendation / Observation"],
    ],

    body: riskRows,

    headStyles: {
      fillColor: WARNING,
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },

    alternateRowStyles: {
      fillColor: LIGHT,
    },

    theme: "grid",

    styles: {
      fontSize: 8.5,
      cellPadding: 3,
    },

    margin: {
      top: 40,
      bottom: 30,
    },

    pageBreak: "auto",
  });

  // -------------------------------------------------
  // CRYPTOGRAPHIC EVIDENCE
  // -------------------------------------------------

  y = addSectionTitle(
    "Cryptographic Evidence",
    nextY()
  );

  const evidenceRows =
    deviceList
      .filter(hasEvidenceHash)
      .map((device) => [
        device.deviceName ||
          device.name ||
          "Unknown",

        device.serialNumber ||
          device.serial ||
          "N/A",

        device.evidenceHash ||
          device.sha256 ||
          device.hash ||
          "N/A",
      ]);

  if (evidenceRows.length === 0) {
    evidenceRows.push([
      "No evidence available",
      "N/A",
      "N/A",
    ]);
  }

  autoTable(doc, {
    startY: y,

    head: [
      ["Device", "Serial", "SHA-256 Evidence Hash"],
    ],

    body: evidenceRows,

    headStyles: {
      fillColor: DARK,
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },

    alternateRowStyles: {
      fillColor: LIGHT,
    },

    theme: "grid",

    styles: {
      fontSize: 7,
      cellPadding: 2.5,
      overflow: "linebreak",
    },

    columnStyles: {
      0: { cellWidth: 45 },
      1: { cellWidth: 40 },
      2: { cellWidth: 95 },
    },

    margin: {
      top: 40,
      bottom: 30,
    },

    pageBreak: "auto",
  });

  // -------------------------------------------------
  // CERTIFICATE SUMMARY
  // -------------------------------------------------

  y = addSectionTitle(
    "Certificate Summary",
    nextY()
  );

  const certificateRows =
    certificateList.length > 0
      ? certificateList.map((certificate) => [
          certificate.certificateId ||
            certificate.id ||
            "N/A",

          certificate.deviceName ||
            certificate.device ||
            "N/A",

          certificate.serialNumber ||
            certificate.serial ||
            "N/A",

          certificate.verificationStatus ||
            certificate.status ||
            "Generated",

          certificate.createdAt ||
            certificate.generatedAt ||
            "N/A",
        ])
      : [
          [
            "No certificates",
            "N/A",
            "N/A",
            "N/A",
            "N/A",
          ],
        ];

  autoTable(doc, {
    startY: y,

    head: [
      [
        "Certificate ID",
        "Device",
        "Serial",
        "Status",
        "Generated",
      ],
    ],

    body: certificateRows,

    headStyles: {
      fillColor: SUCCESS,
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },

    alternateRowStyles: {
      fillColor: LIGHT,
    },

    theme: "grid",

    styles: {
      fontSize: 7.5,
      cellPadding: 2.5,
    },

    margin: {
      top: 40,
      bottom: 30,
    },

    pageBreak: "auto",
  });

  // -------------------------------------------------
  // DIGITAL VERIFICATION
  // -------------------------------------------------

  y = addSectionTitle(
    "Digital Verification",
    nextY()
  );

  y = ensureSpace(y, 45);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...DARK);

  doc.text(
    "TrustWipe generates cryptographic evidence and digitally signed",
    15,
    y
  );

  doc.text(
    "sanitization certificates as part of the verification workflow.",
    15,
    y + 5
  );

  doc.text(
    "Certificate authenticity should be validated through the TrustWipe",
    15,
    y + 10
  );

  doc.text(
    "Verification Portal using the certificate identifier or QR code.",
    15,
    y + 15
  );

  y += 28;

  doc.setDrawColor(...PRIMARY);
  doc.line(15, y, 80, y);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);

  doc.text(
    "Report Authentication Reference",
    15,
    y + 7
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);

  doc.text(
    `Report ID: ${reportId}`,
    15,
    y + 13
  );

  doc.text(
    "Note: This report is not itself represented as a digitally signed PDF.",
    15,
    y + 19
  );

  // -------------------------------------------------
  // SCOPE & LIMITATIONS
  // -------------------------------------------------

  y += 31;

  y = addSectionTitle(
    "Assessment Scope & Limitations",
    y
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...MUTED);

  const scopeText =
    "This assessment is based on information supplied by the TrustWipe " +
    "application, including device records, sanitization status, verification " +
    "results, cryptographic evidence, certificates, and audit logs. The report " +
    "evaluates TrustWipe operational controls and does not independently " +
    "certify the physical state of storage media or the legal/regulatory " +
    "compliance of the organization.";

  const scopeLines = doc.splitTextToSize(
    scopeText,
    PAGE_WIDTH - 30
  );

  doc.text(scopeLines, 15, y + 5);

  // -------------------------------------------------
  // FOOTER
  // -------------------------------------------------

  const pages = doc.getNumberOfPages();

  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);

    doc.setDrawColor(...BORDER);

    doc.line(
      15,
      PAGE_HEIGHT - 18,
      PAGE_WIDTH - 15,
      PAGE_HEIGHT - 18
    );

    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.setFont("helvetica", "normal");

    doc.text(
      "TrustWipe Enterprise",
      15,
      PAGE_HEIGHT - 10
    );

    doc.text(
      "Sanitization Assessment Report",
      PAGE_WIDTH / 2,
      PAGE_HEIGHT - 10,
      { align: "center" }
    );

    doc.text(
      `Page ${i} of ${pages}`,
      PAGE_WIDTH - 15,
      PAGE_HEIGHT - 10,
      { align: "right" }
    );
  }

  return doc;
}