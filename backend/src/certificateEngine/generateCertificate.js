import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import QRCode from "qrcode";

function box(doc, x, y, w, h, title, value) {
  doc
    .roundedRect(x, y, w, h, 6)
    .lineWidth(1)
    .stroke("#d1d5db");

  doc
    .fontSize(8)
    .fillColor("#64748b")
    .text(title, x + 8, y + 8);

  doc
    .fontSize(11)
    .fillColor("#111827")
    .text(
      value || "N/A",
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
  if (!fs.existsSync("certificates")) {
    fs.mkdirSync("certificates", {
      recursive: true,
    });
  }

  const pdfPath = path.join(
    "certificates",
    `${certificate.certificateId}.pdf`
  );

  const doc = new PDFDocument({
    size: "A4",
    margin: 30,
  });

  doc.pipe(fs.createWriteStream(pdfPath));

  //------------------------------------------------
  // HEADER
  //------------------------------------------------

  doc
    .fontSize(22)
    .fillColor("#111827")
    .text(
      "TRUSTWIPE SECURITY AUTHORITY",
      {
        align: "center",
      }
    );

  doc.moveDown(0.4);

  doc
    .fontSize(16)
    .fillColor("#2563eb")
    .text(
      "DATA SANITIZATION CERTIFICATE",
      {
        align: "center",
      }
    );

  doc.moveDown(0.4);

  doc
    .fontSize(9)
    .fillColor("#4b5563")
    .text(
      "Secure and cryptographically verified destruction of digital information.",
      {
        align: "center",
      }
    );

  //------------------------------------------------
  // VERIFIED BADGE
  //------------------------------------------------

  doc
    .roundedRect(
      230,
      105,
      140,
      35,
      8
    )
    .fillAndStroke(
      "#dcfce7",
      "#16a34a"
    );

  doc
    .fontSize(14)
    .fillColor("#15803d")
    .text(
      certificate.verificationStatus,
      255,
      117
    );

  //------------------------------------------------
  // CERTIFICATE DETAILS
  //------------------------------------------------

  doc
    .fontSize(14)
    .fillColor("#111827")
    .text(
      "Certificate Details",
      30,
      170
    );

  box(
    doc,
    30,
    200,
    250,
    55,
    "Certificate ID",
    certificate.certificateId
  );

  box(
    doc,
    300,
    200,
    250,
    55,
    "Job ID",
    certificate.jobId?.toString()
  );

  box(
    doc,
    30,
    270,
    250,
    55,
    "Algorithm",
    certificate.algorithm
  );

  box(
    doc,
    300,
    270,
    250,
    55,
    "Standard",
    certificate.sanitizationStandard
  );

  box(
    doc,
    30,
    340,
    250,
    55,
    "Issue Date",
    new Date(
      certificate.createdAt
    ).toLocaleString()
  );

  box(
    doc,
    300,
    340,
    250,
    55,
    "Authority",
    "TrustWipe Security Authority"
  );

  //------------------------------------------------
  // DEVICE DETAILS
  //------------------------------------------------

  doc
    .fontSize(14)
    .text(
      "Device Information",
      30,
      430
    );

  box(
    doc,
    30,
    460,
    250,
    55,
    "Device Name",
    device.deviceName
  );

  box(
    doc,
    300,
    460,
    250,
    55,
    "Serial Number",
    device.serialNumber
  );

  box(
    doc,
    30,
    530,
    250,
    55,
    "Manufacturer",
    device.manufacturer
  );

  box(
    doc,
    300,
    530,
    250,
    55,
    "Model Number",
    device.modelNumber
  );

  box(
    doc,
    30,
    600,
    250,
    55,
    "Storage Type",
    device.storageType
  );

  box(
    doc,
    300,
    600,
    250,
    55,
    "Capacity",
    device.capacity
  );

  //------------------------------------------------
  // PAGE 2
  //------------------------------------------------

  doc.addPage();

  doc
    .fontSize(18)
    .fillColor("#111827")
    .text(
      "Verification Summary",
      30,
      40
    );

  box(
    doc,
    30,
    80,
    160,
    60,
    "Files Wiped",
    certificate.wipedFiles
  );

  box(
    doc,
    210,
    80,
    160,
    60,
    "Files Verified",
    certificate.verifiedFiles
  );

  box(
    doc,
    390,
    80,
    160,
    60,
    "Verification Failures",
    certificate.verificationFailures
  );

  box(
    doc,
    30,
    170,
    520,
    60,
    "Verification Method",
    certificate.verificationMethod
  );

  //------------------------------------------------
  // HASHES
  //------------------------------------------------

  doc
    .fontSize(16)
    .text(
      "Cryptographic Evidence",
      30,
      270
    );

  doc
    .fontSize(10)
    .fillColor("#111827")
    .text(
      "Verification Hash",
      30,
      305
    );

  doc
    .fontSize(8)
    .fillColor("#16a34a")
    .text(
      certificate.verificationHash,
      30,
      325,
      {
        width: 520,
      }
    );

  doc
    .fontSize(10)
    .fillColor("#111827")
    .text(
      "Evidence Hash",
      30,
      400
    );

  doc
    .fontSize(8)
    .fillColor("#16a34a")
    .text(
      certificate.verificationEvidenceHash,
      30,
      420,
      {
        width: 520,
      }
    );

  //------------------------------------------------
  // SIGNATURE
  //------------------------------------------------

  doc
    .fontSize(16)
    .fillColor("#111827")
    .text(
      "Digital Signature",
      30,
      510
    );

  doc
    .fontSize(7)
    .text(
      certificate.signature,
      30,
      540,
      {
        width: 520,
      }
    );

  //------------------------------------------------
  // QR CODE
  //------------------------------------------------

  try {
    const qr = await QRCode.toDataURL(
      `http://localhost:5173/verify/${certificate.certificateId}`
    );

    doc.image(qr, 420, 610, {
      width: 100,
    });

    doc
      .fontSize(9)
      .text(
        "Scan to Verify",
        430,
        720
      );
  } catch (err) {
    console.log(
      "QR generation failed"
    );
  }

  //------------------------------------------------
  // FOOTER
  //------------------------------------------------

  doc
    .fontSize(10)
    .fillColor("#111827")
    .text(
      "Chief Verification Officer",
      30,
      730
    );

  doc.text(
    "TrustWipe Security Authority",
    30,
    745
  );

  doc.end();

  return pdfPath;
};