import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

import Certificate from "../models/Certificate.js";

export const generateCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;

    const certificate = await Certificate.findOne({
      certificateId,
    }).populate("deviceId");

    console.log(
  "CERTIFICATE DATA:",
  JSON.stringify(certificate, null, 2)
);

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found",
      });
    }

    const certDir = path.join(
      process.cwd(),
      "certificates"
    );

    if (!fs.existsSync(certDir)) {
      fs.mkdirSync(certDir, {
        recursive: true,
      });
    }

    const filePath = path.join(
      certDir,
      `certificate-${certificateId}.pdf`
    );

    const doc = new PDFDocument({
      size: "A4",
      margin: 50,
    });

    const stream = fs.createWriteStream(
      filePath
    );

    doc.pipe(stream);

    // Header
    doc
      .fontSize(22)
      .text(
        "TRUSTWIPE CERTIFICATE OF DATA DESTRUCTION",
        {
          align: "center",
        }
      );

    doc.moveDown(2);

    // Certificate Info
    doc.fontSize(14);

    doc.text(
      `Certificate ID: ${certificate.certificateId}`
    );

    doc.text(
      `Job ID: ${certificate.jobId}`
    );

    doc.text(
      `Verification Status: ${
        certificate.verificationStatus
      }`
    );

    doc.text(
      `Algorithm: ${
        certificate.algorithm || "RSA-SHA256"
      }`
    );

    doc.text(
      `Created At: ${new Date(
        certificate.createdAt
      ).toLocaleString()}`
    );

    doc.moveDown();

    // Device Information
    doc
      .fontSize(16)
      .text("DEVICE INFORMATION");

    doc.moveDown(0.5);

    doc.fontSize(12);

    doc.text(
      `Device Name: ${
        certificate.deviceId?.deviceName || "N/A"
      }`
    );

    doc.text(
      `Serial Number: ${
        certificate.deviceId?.serialNumber || "N/A"
      }`
    );

    doc.text(
      `Storage Type: ${
        certificate.deviceId?.storageType || "N/A"
      }`
    );

    doc.text(
      `Capacity: ${
        certificate.deviceId?.capacity || "N/A"
      }`
    );

    doc.text(
      `Location: ${
        certificate.deviceId?.location || "N/A"
      }`
    );

    doc.moveDown();

    // Signature
    doc
      .fontSize(16)
      .text("CRYPTOGRAPHIC SIGNATURE");

    doc.moveDown(0.5);

    doc.fontSize(10);

    doc.text(
      certificate.signature || "N/A"
    );

    doc.moveDown(2);

    doc.fontSize(12);

    doc.text(
      "This certifies that the device data has been securely wiped and verified according to TrustWipe standards."
    );

    doc.moveDown();

    doc.text(
      "Authorized By: TrustWipe Security Authority"
    );

    doc.end();

    stream.on("finish", () => {
      return res.status(200).json({
        success: true,
        message:
          "Certificate Generated Successfully",
        filePath,
      });
    });

    stream.on("error", (err) => {
      return res.status(500).json({
        success: false,
        message: "Error creating PDF",
        error: err.message,
      });
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const verifyCertificate = async (
  req,
  res
) => {
  try {
    const { certificateId } = req.params;

    const certificate = await Certificate.findOne({
      certificateId,
    }).populate("deviceId");

    console.log(
  "CERTIFICATE DATA:",
  JSON.stringify(certificate, null, 2)
);
    if (!certificate) {
      return res.status(404).json({
        status: "Invalid",
        message: "Certificate not found",
      });
    }

    return res.status(200).json({
      certificateId:
        certificate.certificateId,

      jobId:
        certificate.jobId,

      status:
        certificate.verificationStatus,

      algorithm:
        certificate.algorithm,

      signature:
        certificate.signature,

      createdAt:
        certificate.createdAt,

      deviceModel:
        certificate.deviceId?.deviceName ||
        "N/A",

      serialNumber:
        certificate.deviceId?.serialNumber ||
        "N/A",

      storageType:
        certificate.deviceId?.storageType ||
        "N/A",

      capacity:
        certificate.deviceId?.capacity ||
        "N/A",

      location:
        certificate.deviceId?.location ||
        "N/A",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};