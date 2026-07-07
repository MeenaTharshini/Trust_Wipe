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

export const verifyCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;

    const certificate = await Certificate.findOne({
      certificateId,
    }).populate("deviceId");

    if (!certificate) {
      return res.status(404).json({
        status: "Invalid",
        message: "Certificate not found",
      });
    }

    const device = certificate.deviceId;

    return res.status(200).json({
      certificateId: certificate.certificateId,
      jobId: certificate.jobId,

      status: certificate.verificationStatus,
      verificationStatus:
        certificate.verificationStatus,

      algorithm: certificate.algorithm,

      sanitizationStandard:
        certificate.sanitizationStandard,

      createdAt: certificate.createdAt,
      issuedAt: certificate.issuedAt,

      verificationMethod:
        certificate.verificationMethod,

      verificationHash:
        certificate.verificationHash,

      verificationEvidenceHash:
        certificate.verificationEvidenceHash,

      wipedFiles:
        certificate.wipedFiles,

      verifiedFiles:
        certificate.verifiedFiles,

      verificationFailures:
        certificate.verificationFailures,

      signature:
        certificate.signature,

      // quick fields
      deviceModel:
        device?.deviceName || "N/A",

      serialNumber:
        device?.serialNumber || "N/A",

      storageType:
        device?.storageType || "N/A",

      capacity:
        device?.capacity || "N/A",

      location:
        device?.location || "N/A",

      // FULL DEVICE OBJECT
      device: {
        manufacturer:
          device?.manufacturer || "N/A",

        modelNumber:
          device?.modelNumber || "N/A",

        owner:
          device?.owner || "N/A",

        deviceType:
          device?.deviceType || "N/A",

        storagePath:
          device?.storagePath || "N/A",

        deviceName:
          device?.deviceName || "N/A",

        serialNumber:
          device?.serialNumber || "N/A",

        storageType:
          device?.storageType || "N/A",

        capacity:
          device?.capacity || "N/A",

        location:
          device?.location || "N/A",
      },
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};