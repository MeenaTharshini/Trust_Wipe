import WipeJob from "../models/WipeJob.js";
import Device from "../models/Device.js";
import Certificate from "../models/Certificate.js";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { wipeFile } from "../services/fileWipeService.js";
import { getFilesFromFolder } from "../services/fileService.js";
import { generateCertificate } from "../certificateEngine/generateCertificate.js";
import { getIO } from "../socket/index.js";

/**
 * Helper: emit safely
 */
const emitEvent = (event, data) => {
  try {
    const io = getIO();
    io.emit(event, data);
  } catch (err) {
    console.error("Socket emit error:", err.message);
  }
};

/**
 * MAIN WIPE ENGINE
 */
export const runWipeEngine = async (deviceId,userId) => {
  const device = await Device.findById(deviceId);

  if (!device) {
    throw new Error("Device not found");
  }

  const existingJob = await WipeJob.findOne({
    deviceId,
    status: "running",
  });

  if (existingJob) {
    throw new Error("Wipe already running for this device");
  }

  // ==============================
  // CREATE JOB
  // ==============================
  const job = await WipeJob.create({
    deviceId,
    algorithm: "NIST 800-88 Clear",
    progress: 0,
    status: "running",
    verificationStatus: "Pending",
    totalFiles: 0,
    wipedFiles: 0,
    events: [{ message: "Secure wipe process started" }],
    startedAt: new Date(),
  });

  await Device.findByIdAndUpdate(deviceId, {
    status: "Wiping",
    currentJobId: job._id,
  });

  emitEvent("device-updated");
  emitEvent("wipe-progress", job.toObject());

  try {
    if (!device.storagePath) {
  throw new Error("No storage path configured");
}

const files = getFilesFromFolder(
  device.storagePath
);

if (!files.length) {
  console.log(
    "No files found. Continuing verification."
  );

  job.totalFiles = 0;
  job.wipedFiles = 0;

  job.events.push({
    message:
      "Folder scanned successfully. No files found for sanitization.",
  });

  await job.save();

  const evidence = [];

  const evidenceHash = crypto
    .createHash("sha256")
    .update(JSON.stringify(evidence))
    .digest("hex");

  const verificationHash = crypto
    .createHash("sha256")
    .update(
      JSON.stringify({
        deviceId: device._id.toString(),
        serialNumber: device.serialNumber,
        timestamp: new Date().toISOString(),
      })
    )
    .digest("hex");

  job.verificationHash = verificationHash;
  job.verificationEvidenceHash =
    evidenceHash;

  job.verifiedFiles = 0;
  job.verificationFailures = 0;

  job.verificationMethod =
    "Folder Scan Verification";

  job.verificationStatus = "VERIFIED";

  job.verificationResult =
    "Folder was scanned successfully. No files were found.";

  job.progress = 100;
  job.status = "completed";
  job.completedAt = new Date();

  await job.save();

  const privateKey = fs.readFileSync(
    path.resolve("private.pem"),
    "utf8"
  );

  const signer = crypto.createSign(
    "RSA-SHA256"
  );

  signer.update(verificationHash);
  signer.end();

  const signature = signer.sign(
    privateKey,
    "base64"
  );

  const certificate =
    await Certificate.create({
      certificateId: `TW-${Date.now()}`,
      deviceId: device._id,
      jobId: job._id,

      sanitizationStandard:
        "NIST SP 800-88 Rev.1",

      algorithm: job.algorithm,

      verificationMethod:
        "Folder Scan Verification",

      verificationHash,
      verificationEvidenceHash:
        evidenceHash,

      verificationStatus:
        "VERIFIED",

      wipedFiles: 0,
      verifiedFiles: 0,
      verificationFailures: 0,

      signature,

      remarks:
        "No files were present in the selected folder.",

      // DEVICE DATA
deviceModel:
  certificate.deviceId?.deviceName || "N/A",

serialNumber:
  certificate.deviceId?.serialNumber || "N/A",

storageType:
  certificate.deviceId?.storageType || "N/A",

capacity:
  certificate.deviceId?.capacity || "N/A",

location:
  certificate.deviceId?.location || "N/A",

device: {
  deviceName:
    certificate.deviceId?.deviceName || "",

  manufacturer:
    certificate.deviceId?.manufacturer || "",

  modelNumber:
    certificate.deviceId?.modelNumber || "",

  serialNumber:
    certificate.deviceId?.serialNumber || "",

  owner:
    certificate.deviceId?.owner || "",

  location:
    certificate.deviceId?.location || "",

  deviceType:
    certificate.deviceId?.deviceType || "",

  storageType:
    certificate.deviceId?.storageType || "",

  capacity:
    certificate.deviceId?.capacity || "",

  storagePath:
    certificate.deviceId?.storagePath || "",
},

      verificationConfidence: 100,
    });

  await generateCertificate(
    certificate,
    device
  );

  await Device.findByIdAndUpdate(
    device._id,
    {
      status: "Completed",
    }
  );

  emitEvent("device-updated");

  return job;
}

    job.totalFiles = files.length;
    await job.save();

    // ==============================
    // WIPE PHASE (SIMULATED FOR NOW)
    // ==============================
    let processed = 0;

    job.progress = 10;
    await job.save();
    emitEvent("wipe-progress", job.toObject());

    for (const file of files) {
  console.log(
    `🔥 WIPING FILE: ${file.fileName}`
  );

  const result = await wipeFile(
    file.path
  );

  if (!result.success) {
    throw new Error(result.error);
  }

  processed++;

  job.wipedFiles = processed;

  job.progress =
    10 +
    Math.floor(
      (processed / files.length) * 70
    );

  job.events.push({
    message: `Wiped ${file.fileName}`,
  });

  await job.save();

  emitEvent(
    "wipe-progress",
    job.toObject()
  );
}

    // ==============================
    // VERIFICATION PHASE
    // ==============================
    job.progress = 85;
    job.events.push({
      message: "Performing post-wipe verification",
    });

    await job.save();
    emitEvent("wipe-progress", job.toObject());

    const evidence = [];

    let verifiedFiles = 0;
    let verificationFailures = 0;

    for (const file of files) {
  const exists = fs.existsSync(file.path);

  if (exists) {
    verificationFailures++;

    evidence.push({
      file: file.fileName,
      path: file.path,
      verified: false,
    });
  } else {
    verifiedFiles++;

    evidence.push({
      file: file.fileName,
      path: file.path,
      verified: true,
    });
  }
}

    const evidenceHash = crypto
      .createHash("sha256")
      .update(JSON.stringify(evidence))
      .digest("hex");

    const verificationData = {
      deviceId: device._id.toString(),
      serialNumber: device.serialNumber,
      algorithm: job.algorithm,
      verifiedFiles,
      verificationFailures,
      evidenceHash,
      timestamp: new Date().toISOString(),
    };

    const verificationHash = crypto
      .createHash("sha256")
      .update(JSON.stringify(verificationData))
      .digest("hex");

    job.verificationHash = verificationHash;
    job.verificationEvidenceHash = evidenceHash;
    job.verifiedFiles = verifiedFiles;
    job.verificationFailures = verificationFailures;
    job.verificationBlocksChecked = verifiedFiles;
    job.verificationMethod = "SHA-256 Evidence Validation";

    job.verificationStatus =
      verificationFailures === 0 ? "VERIFIED" : "FAILED";

    job.verificationResult =
      verificationFailures === 0
        ? `${verifiedFiles} files verified successfully`
        : `${verificationFailures} verification failures`;

    job.progress = 90;
    job.events.push({ message: job.verificationResult });

    await job.save();
    emitEvent("wipe-progress", job.toObject());

    // ==============================
    // DIGITAL SIGNATURE
    // ==============================
    const privateKey = fs.readFileSync(
      path.resolve("private.pem"),
      "utf8"
    );

    const signer = crypto.createSign("RSA-SHA256");
    signer.update(verificationHash);
    signer.end();

    const signature = signer.sign(privateKey, "base64");

    // ==============================
    // CERTIFICATE CREATION
    // ==============================
    const certificate = await Certificate.create({
  certificateId: `TW-${Date.now()}`,

  deviceId: device._id,
  jobId: job._id,
  owner: userId,
  
  sanitizationStandard: "NIST SP 800-88 Rev.1",
  algorithm: job.algorithm,

  verificationMethod: job.verificationMethod,

  verificationHash,
  verificationEvidenceHash: evidenceHash,

  verificationStatus: job.verificationStatus,

  wipedFiles: job.wipedFiles || 0,
  verifiedFiles: job.verifiedFiles || 0,
  verificationFailures: job.verificationFailures || 0,

  signature,

  issuedAt: new Date(),
  wipeCompletedAt: new Date(),

  remarks: job.verificationResult,

  deviceModel:
  device.deviceName || "N/A",

serialNumber:
  device.serialNumber || "N/A",

storageType:
  device.storageType || "N/A",

capacity:
  device.capacity || "N/A",

location:
  device.location || "N/A",

device: {
  deviceName:
    device.deviceName || "",

  manufacturer:
    device.manufacturer || "",

  modelNumber:
    device.modelNumber || "",

  serialNumber:
    device.serialNumber || "",

  owner:
    device.owner || "",

  location:
    device.location || "",

  deviceType:
    device.deviceType || "",

  storageType:
    device.storageType || "",

  capacity:
    device.capacity || "",

  storagePath:
    device.storagePath || "",
},

  verificationConfidence:
    verificationFailures === 0
      ? 100
      : 0,
});

    await generateCertificate(certificate, device);

    job.certificateId = certificate.certificateId;
    await job.save();

    console.log("PDF GENERATED");

    // ==============================
    // COMPLETION
    // ==============================
    job.progress = 100;
    job.status = "completed";
    job.completedAt = new Date();

    job.duration = Math.floor(
      (job.completedAt - job.startedAt) / 1000
    );

    job.events.push({ message: "Certificate generated" });

    await job.save();

    await Device.findByIdAndUpdate(deviceId, {
      status: "Completed",
    });

    emitEvent("wipe-progress", job.toObject());
    emitEvent("device-updated");

    console.log("WIPE COMPLETED");

    return job;
  } catch (err) {
    console.error("WIPE ENGINE ERROR:", err.message);

    job.status = "failed";
    job.failureReason = err.message;

    await job.save();

    await Device.findByIdAndUpdate(deviceId, {
      status: "Failed",
    });

    emitEvent("wipe-progress", job.toObject());
    emitEvent("device-updated");

    throw err;
  }
};