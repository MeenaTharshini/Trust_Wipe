
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export default function generateComplianceReport(data = {}) {
  const {
    devices = [],
    certificates = [],
    generatedBy = "TrustWipe Enterprise",
  } = data;

  const doc = new jsPDF("p", "mm", "a4");

  const PAGE_WIDTH = doc.internal.pageSize.getWidth();
  const PAGE_HEIGHT = doc.internal.pageSize.getHeight();

  // =========================================================
  // COLORS
  // =========================================================

  const PRIMARY = [0, 180, 255];
  const DARK = [30, 41, 59];
  const SUCCESS = [22, 163, 74];
  const WARNING = [245, 158, 11];
  const DANGER = [220, 38, 38];
  const MUTED = [100, 116, 139];
  const LIGHT = [248, 250, 252];
  const BORDER = [226, 232, 240];
  const WHITE = [255, 255, 255];

  // =========================================================
  // REPORT INFORMATION
  // =========================================================

  const now = new Date();

  const reportId =
    `TWR-CMP-${now.getFullYear()}-` +
    `${String(now.getMonth() + 1).padStart(2, "0")}` +
    `${String(now.getDate()).padStart(2, "0")}-` +
    `${String(now.getHours()).padStart(2, "0")}` +
    `${String(now.getMinutes()).padStart(2, "0")}` +
    `${String(now.getSeconds()).padStart(2, "0")}`;

  const generatedAt = now.toLocaleString();

  // =========================================================
  // NORMALIZE DATA
  // =========================================================

  const safeDevices = Array.isArray(devices) ? devices : [];
  const safeCertificates = Array.isArray(certificates)
    ? certificates
    : [];

  const totalAssets = safeDevices.length;

  const completedAssets = safeDevices.filter(
    (d) =>
      String(d?.status || "").toLowerCase() === "completed"
  ).length;

  const pendingAssets = safeDevices.filter(
    (d) =>
      String(d?.status || "").toLowerCase() === "pending"
  ).length;

  const runningAssets = safeDevices.filter(
    (d) =>
      ["wiping", "running", "in progress"].includes(
        String(d?.status || "").toLowerCase()
      )
  ).length;

  const failedAssets = safeDevices.filter(
    (d) =>
      ["failed", "error", "interrupted"].includes(
        String(d?.status || "").toLowerCase()
      )
  ).length;

  const verifiedAssets = safeDevices.filter(
    (d) =>
      ["verified", "successful", "passed"].includes(
        String(
          d?.verificationStatus ||
            d?.verification ||
            ""
        ).toLowerCase()
      )
  ).length;

  const identifiedAssets = safeDevices.filter(
    (d) =>
      d?.deviceName ||
      d?.serialNumber ||
      d?.deviceId
  ).length;

  const evidenceRecords = safeDevices.filter(
    (d) =>
      d?.evidenceHash ||
      d?.hash ||
      d?.sha256 ||
      d?.cryptographicEvidence
  ).length;

  const certificateCount = safeCertificates.length;

  const certificateVerified = safeCertificates.filter(
    (c) =>
      String(c?.status || "").toLowerCase() === "verified"
  ).length;

  const sanitizationCoverage =
    totalAssets > 0
      ? Math.round((completedAssets / totalAssets) * 100)
      : 0;

  const verificationCoverage =
    totalAssets > 0
      ? Math.round((verifiedAssets / totalAssets) * 100)
      : 0;

  const identificationCoverage =
    totalAssets > 0
      ? Math.round((identifiedAssets / totalAssets) * 100)
      : 0;

  const evidenceCoverage =
    totalAssets > 0
      ? Math.round((evidenceRecords / totalAssets) * 100)
      : 0;

  const certificateCoverage =
    totalAssets > 0
      ? Math.min(
          100,
          Math.round((certificateCount / totalAssets) * 100)
        )
      : 0;

  /*
   * IMPORTANT:
   * The report's overall status is based on the recorded
   * TrustWipe operational results only.
   *
   * It does NOT claim independent ISO/GDPR/HIPAA compliance.
   */

  const overallPassed =
    totalAssets > 0 &&
    completedAssets === totalAssets &&
    pendingAssets === 0 &&
    runningAssets === 0 &&
    failedAssets === 0 &&
    verifiedAssets === totalAssets &&
    certificateCount >= totalAssets;

  const overallStatus = overallPassed
    ? "PASSED"
    : "REVIEW REQUIRED";

  // =========================================================
  // HELPERS
  // =========================================================

  function setText(color = DARK) {
    doc.setTextColor(...color);
  }

  function sectionTitle(title, y) {
    setText(DARK);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.text(title, 15, y);

    doc.setDrawColor(...PRIMARY);
    doc.setLineWidth(0.7);
    doc.line(15, y + 3, 42, y + 3);

    return y + 10;
  }

  function getTableEnd() {
    return doc.lastAutoTable
      ? doc.lastAutoTable.finalY + 12
      : 42;
  }

  function ensureSpace(y, required = 35) {
    if (y + required > PAGE_HEIGHT - 28) {
      doc.addPage();
      return 25;
    }

    return y;
  }

  function drawStatusBadge(text, x, y, width = 55) {
    let fill = SUCCESS;

    if (
      text === "REVIEW REQUIRED" ||
      text === "REVIEW"
    ) {
      fill = WARNING;
    }

    if (
      text === "FAILED" ||
      text === "ERROR"
    ) {
      fill = DANGER;
    }

    doc.setFillColor(...fill);
    doc.roundedRect(
      x,
      y,
      width,
      12,
      2,
      2,
      "F"
    );

    doc.setTextColor(...WHITE);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);

    doc.text(
      text,
      x + width / 2,
      y + 8,
      { align: "center" }
    );
  }

  function addFooter() {
    const pages = doc.getNumberOfPages();

    for (let page = 1; page <= pages; page++) {
      doc.setPage(page);

      doc.setDrawColor(...BORDER);
      doc.setLineWidth(0.3);

      doc.line(
        15,
        PAGE_HEIGHT - 18,
        PAGE_WIDTH - 15,
        PAGE_HEIGHT - 18
      );

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(...MUTED);

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
        `Page ${page} of ${pages}`,
        PAGE_WIDTH - 15,
        PAGE_HEIGHT - 10,
        { align: "right" }
      );
    }
  }

  // =========================================================
  // HEADER
  // =========================================================

  doc.setFillColor(...PRIMARY);
  doc.rect(
    0,
    0,
    PAGE_WIDTH,
    30,
    "F"
  );

  doc.setTextColor(...WHITE);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);

  doc.text(
    "TrustWipe Enterprise",
    15,
    14
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);

  doc.text(
    "Sanitization Assessment Report",
    15,
    22
  );

  // =========================================================
  // REPORT TITLE
  // =========================================================

  let y = 42;

  setText(DARK);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(21);

  doc.text(
    "Sanitization Assessment",
    15,
    y
  );

  y += 9;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  setText(MUTED);

  doc.text(
    `Report ID: ${reportId}`,
    15,
    y
  );

  y += 6;

  doc.text(
    `Generated: ${generatedAt}`,
    15,
    y
  );

  y += 6;

  doc.text(
    `Generated By: ${generatedBy}`,
    15,
    y
  );

  // =========================================================
  // EXECUTIVE SUMMARY
  // =========================================================

  y = sectionTitle(
    "Executive Summary",
    y + 15
  );

  autoTable(doc, {
    startY: y,

    head: [
      [
        "Metric",
        "Result",
        "Coverage",
      ],
    ],

    body: [
      [
        "Total Assets",
        totalAssets,
        totalAssets > 0 ? "100%" : "0%",
      ],
      [
        "Sanitization Completed",
        completedAssets,
        `${sanitizationCoverage}%`,
      ],
      [
        "Verification Successful",
        verifiedAssets,
        `${verificationCoverage}%`,
      ],
      [
        "Certificates Generated",
        certificateCount,
        `${certificateCoverage}%`,
      ],
      [
        "Device Identification",
        identifiedAssets,
        `${identificationCoverage}%`,
      ],
      [
        "Cryptographic Evidence",
        evidenceRecords,
        `${evidenceCoverage}%`,
      ],
      [
        "Failed / Interrupted",
        failedAssets,
        totalAssets > 0
          ? `${Math.round(
              (failedAssets / totalAssets) * 100
            )}%`
          : "0%",
      ],
    ],

    theme: "grid",

    headStyles: {
      fillColor: PRIMARY,
      textColor: WHITE,
      fontStyle: "bold",
    },

    alternateRowStyles: {
      fillColor: LIGHT,
    },

    styles: {
      fontSize: 9,
      cellPadding: 3,
      textColor: DARK,
    },

    columnStyles: {
      0: { cellWidth: 85 },
      1: { cellWidth: 35, halign: "center" },
      2: { cellWidth: 35, halign: "center" },
    },

    margin: {
      left: 15,
      right: 15,
      top: 35,
      bottom: 28,
    },

    pageBreak: "auto",
  });

  // =========================================================
  // OVERALL ASSESSMENT
  // =========================================================

  y = getTableEnd();

  y = ensureSpace(y, 45);

  y = sectionTitle(
    "Overall Assessment",
    y
  );

  drawStatusBadge(
    overallStatus,
    15,
    y,
    overallStatus === "PASSED"
      ? 55
      : 65
  );

  y += 20;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  setText(MUTED);

  const overallText = overallPassed
    ? "All recorded TrustWipe sanitization operations have completed successfully, with successful verification and certificate coverage for the assessed assets."
    : "The recorded TrustWipe results require review because one or more sanitization, verification, certificate, or operational controls are incomplete.";

  const overallLines =
    doc.splitTextToSize(
      overallText,
      PAGE_WIDTH - 30
    );

  doc.text(
    overallLines,
    15,
    y
  );

  y += overallLines.length * 4 + 10;

  // =========================================================
  // TRUSTWIPE CONTROL ASSESSMENT
  // =========================================================

  y = ensureSpace(y, 55);

  y = sectionTitle(
    "TrustWipe Control Assessment",
    y
  );

  const controlRows = [
    [
      "Device Identification",
      identifiedAssets === totalAssets &&
      totalAssets > 0
        ? "PASS"
        : "REVIEW",
      `${identifiedAssets}/${totalAssets} assets contain device identification data.`,
    ],

    [
      "Sanitization Execution",
      completedAssets === totalAssets &&
      totalAssets > 0
        ? "PASS"
        : "REVIEW",
      `${completedAssets}/${totalAssets} sanitization operations completed.`,
    ],

    [
      "Post-Operation Verification",
      verifiedAssets === totalAssets &&
      totalAssets > 0
        ? "PASS"
        : "REVIEW",
      `${verifiedAssets}/${totalAssets} assets have successful verification status.`,
    ],

    [
      "Certificate Generation",
      certificateCount >= totalAssets &&
      totalAssets > 0
        ? "PASS"
        : "REVIEW",
      `${certificateCount} certificate record(s) available for ${totalAssets} asset(s).`,
    ],

    [
      "Cryptographic Evidence",
      evidenceRecords === totalAssets &&
      totalAssets > 0
        ? "PASS"
        : "REVIEW",
      `${evidenceRecords}/${totalAssets} assets contain recorded evidence.`,
    ],

    [
      "Operational Exceptions",
      failedAssets === 0 &&
      pendingAssets === 0 &&
      runningAssets === 0
        ? "PASS"
        : "REVIEW",
      `${pendingAssets} pending, ${runningAssets} running, ${failedAssets} failed/interrupted.`,
    ],
  ];

  autoTable(doc, {
    startY: y,

    head: [
      [
        "Control",
        "Status",
        "Evidence / Basis",
      ],
    ],

    body: controlRows,

    theme: "grid",

    headStyles: {
      fillColor: SUCCESS,
      textColor: WHITE,
      fontStyle: "bold",
    },

    alternateRowStyles: {
      fillColor: LIGHT,
    },

    styles: {
      fontSize: 8.5,
      cellPadding: 3,
      textColor: DARK,
    },

    columnStyles: {
      0: { cellWidth: 52 },
      1: { cellWidth: 25, halign: "center" },
      2: { cellWidth: 78 },
    },

    margin: {
      left: 15,
      right: 15,
      top: 35,
      bottom: 28,
    },

    pageBreak: "auto",
  });

  // =========================================================
  // REFERENCE FRAMEWORKS
  // =========================================================

  y = getTableEnd();

  y = sectionTitle(
    "Reference Frameworks",
    y
  );

  autoTable(doc, {
    startY: y,

    head: [
      [
        "Framework",
        "Reference Status",
        "Scope",
      ],
    ],

    body: [
      [
        "NIST SP 800-88 Rev.2",
        "REFERENCE",
        "Media sanitization guidance",
      ],
      [
        "ISO/IEC 27001",
        "REFERENCE",
        "Information security management",
      ],
      [
        "GDPR Article 17",
        "REFERENCE",
        "Right to erasure",
      ],
      [
        "HIPAA",
        "REFERENCE",
        "Healthcare information security",
      ],
    ],

    theme: "grid",

    headStyles: {
      fillColor: PRIMARY,
      textColor: WHITE,
      fontStyle: "bold",
    },

    alternateRowStyles: {
      fillColor: LIGHT,
    },

    styles: {
      fontSize: 8.5,
      cellPadding: 3,
      textColor: DARK,
    },

    margin: {
      left: 15,
      right: 15,
      top: 35,
      bottom: 28,
    },

    pageBreak: "auto",
  });

  // =========================================================
  // IMPORTANT ASSESSMENT NOTE
  // =========================================================

  y = getTableEnd();

  y = ensureSpace(y, 55);

  y = sectionTitle(
    "Important Assessment Note",
    y
  );

  doc.setFillColor(...LIGHT);

  doc.roundedRect(
    15,
    y,
    PAGE_WIDTH - 30,
    32,
    2,
    2,
    "F"
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  setText(MUTED);

  const noteText =
    "This report records TrustWipe operational results and evidence available within the reporting data. Reference frameworks are provided for assessment context only. A successful TrustWipe assessment does not by itself constitute independent certification or legal compliance with ISO/IEC 27001, GDPR, HIPAA, or any other regulation.";

  const noteLines =
    doc.splitTextToSize(
      noteText,
      PAGE_WIDTH - 40
    );

  doc.text(
    noteLines,
    20,
    y + 8
  );

  y += 43;

  // =========================================================
  // ASSET INVENTORY
  // =========================================================

  y = ensureSpace(y, 50);

  y = sectionTitle(
    "Asset Inventory",
    y
  );

  const assetRows = safeDevices.length
    ? safeDevices.map((device, index) => {
        const verification =
          device?.verificationStatus ||
          device?.verification ||
          "Not Assessed";

        return [
          device?.deviceName ||
            device?.deviceId ||
            `ASSET-${String(index + 1).padStart(3, "0")}`,

          device?.serialNumber ||
            device?.serial ||
            "N/A",

          device?.storageType ||
            device?.mediaType ||
            "N/A",

          device?.capacity ||
            "N/A",

          device?.status ||
            "Unknown",

          verification,
        ];
      })
    : [
        [
          "No assets recorded",
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

    theme: "grid",

    headStyles: {
      fillColor: PRIMARY,
      textColor: WHITE,
      fontStyle: "bold",
    },

    alternateRowStyles: {
      fillColor: LIGHT,
    },

    styles: {
      fontSize: 6.8,
      cellPadding: 2.2,
      overflow: "linebreak",
      textColor: DARK,
    },

    columnStyles: {
      0: { cellWidth: 36 },
      1: { cellWidth: 52 },
      2: { cellWidth: 18 },
      3: { cellWidth: 23 },
      4: { cellWidth: 27 },
      5: { cellWidth: 29 },
    },

    margin: {
      left: 15,
      right: 15,
      top: 35,
      bottom: 28,
    },

    pageBreak: "auto",
  });

  // =========================================================
  // RISK ASSESSMENT
  // =========================================================

  y = getTableEnd();

  y = sectionTitle(
    "Risk Assessment",
    y
  );

  const riskRows = [
    [
      "Pending Devices",
      pendingAssets > 0 ? "MEDIUM" : "NONE",
      pendingAssets > 0
        ? `${pendingAssets} asset(s) pending sanitization.`
        : "No pending sanitization operations.",
    ],

    [
      "Running Operations",
      runningAssets > 0 ? "LOW" : "NONE",
      runningAssets > 0
        ? `${runningAssets} active operation(s).`
        : "No active sanitization operations.",
    ],

    [
      "Failed / Interrupted",
      failedAssets > 0 ? "HIGH" : "NONE",
      failedAssets > 0
        ? `${failedAssets} operation(s) failed or interrupted.`
        : "No failed or interrupted operations.",
    ],

    [
      "Unverified Assets",
      verifiedAssets < totalAssets
        ? "MEDIUM"
        : "NONE",
      verifiedAssets < totalAssets
        ? `${totalAssets - verifiedAssets} asset(s) lack successful verification.`
        : "All assessed assets have successful verification.",
    ],

    [
      "Missing Evidence",
      evidenceRecords < totalAssets
        ? "MEDIUM"
        : "NONE",
      evidenceRecords < totalAssets
        ? `${totalAssets - evidenceRecords} asset(s) lack recorded evidence.`
        : "Evidence records available for all assessed assets.",
    ],
  ];

  autoTable(doc, {
    startY: y,

    head: [
      [
        "Risk Area",
        "Severity",
        "Observation",
      ],
    ],

    body: riskRows,

    theme: "grid",

    headStyles: {
      fillColor: WARNING,
      textColor: WHITE,
      fontStyle: "bold",
    },

    alternateRowStyles: {
      fillColor: LIGHT,
    },

    styles: {
      fontSize: 8.5,
      cellPadding: 3,
      textColor: DARK,
    },

    columnStyles: {
      0: { cellWidth: 48 },
      1: { cellWidth: 28, halign: "center" },
      2: { cellWidth: 91 },
    },

    margin: {
      left: 15,
      right: 15,
      top: 35,
      bottom: 28,
    },

    pageBreak: "auto",
  });

  // =========================================================
  // CRYPTOGRAPHIC EVIDENCE
  // =========================================================

  y = getTableEnd();

  y = sectionTitle(
    "Cryptographic Evidence",
    y
  );

  const evidenceRows = safeDevices.length
    ? safeDevices.map((device, index) => [
        device?.deviceId ||
          `ASSET-${String(index + 1).padStart(3, "0")}`,

        device?.serialNumber ||
          device?.serial ||
          "N/A",

        device?.sha256 ||
          device?.evidenceHash ||
          device?.hash ||
          "Not Recorded",

        device?.sha256 ||
          device?.evidenceHash ||
          device?.hash
          ? "RECORDED"
          : "NOT AVAILABLE",
      ])
    : [
        [
          "N/A",
          "N/A",
          "N/A",
          "NO EVIDENCE",
        ],
      ];

  autoTable(doc, {
    startY: y,

    head: [
      [
        "Device ID",
        "Serial",
        "SHA-256 Evidence",
        "Status",
      ],
    ],

    body: evidenceRows,

    theme: "grid",

    headStyles: {
      fillColor: DARK,
      textColor: WHITE,
      fontStyle: "bold",
    },

    alternateRowStyles: {
      fillColor: LIGHT,
    },

    styles: {
      fontSize: 7.2,
      cellPadding: 2.5,
      overflow: "linebreak",
      textColor: DARK,
    },

    margin: {
      left: 15,
      right: 15,
      top: 35,
      bottom: 28,
    },

    pageBreak: "auto",
  });

  // =========================================================
  // CERTIFICATE SUMMARY
  // =========================================================

  y = getTableEnd();

  y = sectionTitle(
    "Certificate Summary",
    y
  );

  const certificateRows = safeCertificates.length
    ? safeCertificates.map((certificate, index) => [
        certificate?.certificateId ||
          certificate?.id ||
          `CERT-TW-${String(index + 1).padStart(4, "0")}`,

        certificate?.deviceId ||
          certificate?.serialNumber ||
          "N/A",

        certificate?.status ||
          "RECORDED",

        certificate?.generatedAt ||
          certificate?.createdAt ||
          "N/A",
      ])
    : [
        [
          "No certificates recorded",
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
        "Device / Serial",
        "Status",
        "Generated",
      ],
    ],

    body: certificateRows,

    theme: "grid",

    headStyles: {
      fillColor: SUCCESS,
      textColor: WHITE,
      fontStyle: "bold",
    },

    alternateRowStyles: {
      fillColor: LIGHT,
    },

    styles: {
      fontSize: 7.5,
      cellPadding: 2.7,
      overflow: "linebreak",
      textColor: DARK,
    },

    margin: {
      left: 15,
      right: 15,
      top: 35,
      bottom: 28,
    },

    pageBreak: "auto",
  });

  // =========================================================
  // AUDIT ACTIVITY SUMMARY
  // =========================================================

  y = getTableEnd();

  y = sectionTitle(
    "Audit Activity Summary",
    y
  );

  /*
   * These values summarize recorded TrustWipe operations.
   * They are derived from the current device records.
   */

  const auditRows = [
    [
      "Device Identification",
      identifiedAssets,
      identifiedAssets === totalAssets
        ? "PASS"
        : "REVIEW",
    ],

    [
      "Sanitization Completion",
      completedAssets,
      completedAssets === totalAssets
        ? "PASS"
        : "REVIEW",
    ],

    [
      "Verification",
      verifiedAssets,
      verifiedAssets === totalAssets
        ? "PASS"
        : "REVIEW",
    ],

    [
      "Certificate Generation",
      certificateCount,
      certificateCount >= totalAssets
        ? "PASS"
        : "REVIEW",
    ],

    [
      "Evidence Records",
      evidenceRecords,
      evidenceRecords === totalAssets
        ? "PASS"
        : "REVIEW",
    ],
  ];

  autoTable(doc, {
    startY: y,

    head: [
      [
        "Audit Control",
        "Recorded Events",
        "Status",
      ],
    ],

    body: auditRows,

    theme: "grid",

    headStyles: {
      fillColor: PRIMARY,
      textColor: WHITE,
      fontStyle: "bold",
    },

    alternateRowStyles: {
      fillColor: LIGHT,
    },

    styles: {
      fontSize: 8.5,
      cellPadding: 3,
      textColor: DARK,
    },

    margin: {
      left: 15,
      right: 15,
      top: 35,
      bottom: 28,
    },

    pageBreak: "auto",
  });

  // =========================================================
  // DIGITAL VERIFICATION
  // =========================================================

  y = getTableEnd();

  y = ensureSpace(y, 75);

  y = sectionTitle(
    "Digital Verification",
    y
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  setText(DARK);

  doc.text(
    "TrustWipe certificate records are identified using unique certificate IDs.",
    15,
    y
  );

  doc.text(
    "Certificate verification status is reported from the supplied certificate records.",
    15,
    y + 6
  );

  doc.text(
    `Certificates recorded: ${certificateCount}`,
    15,
    y + 12
  );

  doc.text(
    `Certificates marked VERIFIED: ${certificateVerified}`,
    15,
    y + 18
  );

  y += 30;

  doc.setDrawColor(...PRIMARY);
  doc.setLineWidth(0.6);

  doc.line(
    15,
    y,
    80,
    y
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);

  setText(DARK);

  doc.text(
    "Report Authentication Reference",
    15,
    y + 8
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  setText(MUTED);

  doc.text(
    `Report ID: ${reportId}`,
    15,
    y + 15
  );

  doc.text(
    "This PDF is a generated assessment record and is not itself represented as a digitally signed PDF.",
    15,
    y + 22
  );

  // =========================================================
  // SCOPE & LIMITATIONS
  // =========================================================

  y += 34;

  y = ensureSpace(y, 65);

  y = sectionTitle(
    "Assessment Scope & Limitations",
    y
  );

  const scopeText =
    "This report presents the recorded TrustWipe Enterprise sanitization assessment results for the reporting period. The assessment summarizes device identification, sanitization completion, verification status, certificate records, cryptographic evidence, and operational activity supplied to the report generator. Reference frameworks are included for assessment context and do not represent independent legal, regulatory, or third-party certification.";

  const scopeLines =
    doc.splitTextToSize(
      scopeText,
      PAGE_WIDTH - 30
    );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  setText(MUTED);

  doc.text(
    scopeLines,
    15,
    y + 5
  );

  // =========================================================
  // FOOTER
  // =========================================================

  addFooter();

  return doc;
}
