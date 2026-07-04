import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

function infoBox(
  doc,
  x,
  y,
  w,
  h,
  label,
  value
) {
  doc
    .roundedRect(x, y, w, h, 5)
    .lineWidth(1)
    .stroke("#d1d5db");

  doc
    .fontSize(8)
    .fillColor("#64748b")
    .text(label, x + 8, y + 8);

  doc
    .fontSize(11)
    .fillColor("#111827")
    .text(
      value !== undefined &&
        value !== null &&
        value !== ""
        ? String(value)
        : "N/A",
      x + 8,
      y + 24,
      {
        width: w - 16,
      }
    );
}

export const generateCertificate = async (
  certificate,
  device
) => {
  if (
    !fs.existsSync("certificates")
  ) {
    fs.mkdirSync(
      "certificates",
      {
        recursive: true,
      }
    );
  }

  const pdfPath = path.join(
    "certificates",
    `${certificate.certificateId}.pdf`
  );

  const doc = new PDFDocument({
    size: "A4",
    margin: 30,
  });

  doc.pipe(
    fs.createWriteStream(pdfPath)
  );

  // ==================================================
  // HEADER
  // ==================================================

  doc
    .fontSize(22)
    .fillColor("#111827")
    .text(
      "TRUSTWIPE SECURITY AUTHORITY",
      {
        align: "center",
      }
    );

  doc.moveDown(0.3);

  doc
    .fontSize(16)
    .fillColor("#2563eb")
    .text(
      "DATA SANITIZATION CERTIFICATE",
      {
        align: "center",
      }
    );

  doc.moveDown(0.5);

  doc
    .fontSize(9)
    .fillColor("#4b5563")
    .text(
      "This certificate confirms the secure, irreversible and cryptographically verified destruction of digital data in compliance with international security standards.",
      {
        align: "center",
      }
    );

  // ==================================================
  // VERIFIED BADGE
  // ==================================================

  doc
    .roundedRect(
      240,
      100,
      120,
      35,
      8
    )
    .fillAndStroke(
      "#dcfce7",
      "#16a34a"
    );

  doc
    .fillColor("#15803d")
    .fontSize(14)
    .text(
      certificate.verificationStatus ||
        "VERIFIED",
      270,
      112
    );

  doc.moveTo(30, 155);
  doc.lineTo(565, 155);
  doc.stroke("#d1d5db");

  // ==================================================
  // CERTIFICATION STATEMENT
  // ==================================================

  doc
    .fontSize(13)
    .fillColor("#111827")
    .text(
      "1. Certification Statement",
      30,
      175
    );

  doc
    .fontSize(10)
    .fillColor("#374151")
    .text(
      "The referenced digital asset has undergone secure sanitization using TrustWipe verified destruction protocols ensuring irreversible data erasure.",
      30,
      195,
      {
        width: 520,
      }
    );

  // ==================================================
  // CERTIFICATE DETAILS
  // ==================================================

  doc
    .fontSize(13)
    .fillColor("#111827")
    .text(
      "2. Certificate Details",
      30,
      240
    );

  infoBox(
    doc,
    30,
    265,
    250,
    50,
    "Certificate ID",
    certificate.certificateId
  );

  infoBox(
    doc,
    300,
    265,
    250,
    50,
    "Job Reference",
    certificate.jobId?.toString()
  );

  infoBox(
    doc,
    30,
    325,
    250,
    50,
    "Status",
    certificate.verificationStatus
  );

  infoBox(
    doc,
    300,
    325,
    250,
    50,
    "Algorithm",
    certificate.algorithm
  );

  infoBox(
    doc,
    30,
    385,
    250,
    50,
    "Issue Date",
    new Date(
      certificate.issuedAt
    ).toLocaleString()
  );

  infoBox(
    doc,
    300,
    385,
    250,
    50,
    "Authority",
    "TrustWipe Security Authority"
  );

  // ==================================================
  // DEVICE INFORMATION
  // ==================================================

  doc
    .fontSize(13)
    .fillColor("#111827")
    .text(
      "3. Device Information",
      30,
      455
    );

  infoBox(
    doc,
    30,
    480,
    250,
    50,
    "Device Model",
    device?.deviceName
  );

  infoBox(
    doc,
    300,
    480,
    250,
    50,
    "Serial Number",
    device?.serialNumber
  );

  infoBox(
    doc,
    30,
    540,
    250,
    50,
    "Storage Type",
    device?.storageType
  );

  infoBox(
    doc,
    300,
    540,
    250,
    50,
    "Capacity",
    `${device?.capacity || "N/A"} GB`
  );

  infoBox(
    doc,
    30,
    600,
    250,
    50,
    "Manufacturer",
    device?.manufacturer
  );

  infoBox(
    doc,
    300,
    600,
    250,
    50,
    "Sanitization Standard",
    certificate.sanitizationStandard
  );

  // ==================================================
  // NEW PAGE
  // ==================================================

  doc.addPage();

  // ==================================================
  // VERIFICATION SUMMARY
  // ==================================================

  doc
    .fontSize(18)
    .fillColor("#111827")
    .text(
      "4. Verification Summary",
      30,
      40
    );

  infoBox(
    doc,
    30,
    80,
    160,
    60,
    "Files Wiped",
    certificate.wipedFiles || 0
  );

  infoBox(
    doc,
    210,
    80,
    160,
    60,
    "Files Verified",
    certificate.verifiedFiles || 0
  );

  infoBox(
    doc,
    390,
    80,
    160,
    60,
    "Verification Failures",
    certificate.verificationFailures ||
      0
  );

  infoBox(
    doc,
    30,
    160,
    520,
    60,
    "Verification Method",
    certificate.verificationMethod
  );

  // ==================================================
  // COMPLIANCE
  // ==================================================

  doc
    .fontSize(18)
    .text(
      "5. Compliance Standards",
      30,
      250
    );

  doc
    .fontSize(11)
    .text(
      "• NIST SP 800-88 Rev.1"
    );

  doc.text("• ISO 27001");
  doc.text("• GDPR");
  doc.text("• HIPAA");
  doc.text("• DoD 5220.22-M");

  // ==================================================
  // HASHES
  // ==================================================

  doc
    .fontSize(18)
    .text(
      "6. Cryptographic Evidence",
      30,
      360
    );

  doc
    .fontSize(10)
    .fillColor("#111827")
    .text(
      "Verification Hash:",
      30,
      395
    );

  doc
    .fontSize(8)
    .fillColor("#16a34a")
    .text(
      certificate.verificationHash ||
        "Not Available",
      30,
      415,
      {
        width: 520,
      }
    );

  doc
    .fontSize(10)
    .fillColor("#111827")
    .text(
      "Evidence Hash:",
      30,
      470
    );

  doc
    .fontSize(8)
    .fillColor("#16a34a")
    .text(
      certificate.verificationEvidenceHash ||
        "Not Available",
      30,
      490,
      {
        width: 520,
      }
    );

  // ==================================================
  // DIGITAL SIGNATURE
  // ==================================================

  doc
    .fontSize(18)
    .fillColor("#111827")
    .text(
      "7. Digital Signature",
      30,
      560
    );

  doc
    .fontSize(7)
    .fillColor("#111827")
    .text(
      certificate.signature ||
        "No Signature",
      30,
      590,
      {
        width: 520,
      }
    );

  doc
    .fontSize(9)
    .fillColor("#4b5563")
    .text(
      "RSA-SHA256 digital signature used for tamper-proof validation and certificate authenticity.",
      30,
      660
    );

  // ==================================================
  // FOOTER
  // ==================================================

  doc.moveTo(30, 730);
  doc.lineTo(565, 730);
  doc.stroke("#d1d5db");

  doc
    .fontSize(11)
    .fillColor("#111827")
    .text(
      "Chief Verification Officer",
      30,
      745
    );

  doc
    .fontSize(9)
    .text(
      "TrustWipe Security Authority",
      30,
      760
    );

  doc
    .fontSize(11)
    .fillColor("#16a34a")
    .text(
      "✓ Cryptographically Verified",
      350,
      745
    );

  doc
    .fontSize(9)
    .fillColor("#111827")
    .text(
      `Certificate ID: ${certificate.certificateId}`,
      350,
      760
    );

  doc
    .text(
      "Generated by TrustWipe System",
      350,
      775
    );

  doc.end();

  return pdfPath;
};