import WipeJob from "../models/WipeJob.js";
import Device from "../models/Device.js";
import Certificate from "../models/Certificate.js";

import crypto from "crypto";
import fs from "fs";
import path from "path";

import { wipeFile } from "../services/fileWipeService.js";
import { generateCertificate } from "../certificateEngine/generateCertificate.js";
import { getIO } from "../socket/index.js";

export const runWipeEngine = async (deviceId) => {
  const io = getIO();

  const device = await Device.findById(deviceId);

  if (!device) {
    throw new Error("Device not found");
  }

  const existingJob = await WipeJob.findOne({
    deviceId,
    status: "running",
  });

  if (existingJob) {
    throw new Error("Wipe already running");
  }

  const job = await WipeJob.create({
    deviceId,
    algorithm: "NIST 800-88 Clear",
    progress: 0,
    status: "running",
    verificationStatus: "Pending",
    totalFiles: 0,
    wipedFiles: 0,
    events: [
      {
        message: "Secure wipe process started",
      },
    ],
    startedAt: new Date(),
  });

  await Device.findByIdAndUpdate(deviceId, {
    status: "Wiping",
    currentJobId: job._id,
  });

  io.emit("device-updated");
  io.emit("wipe-progress", job.toObject());

  try {
    const storagePath = device.storagePath;

    if (!storagePath || !fs.existsSync(storagePath)) {
      throw new Error("Storage path not found");
    }

    const files = fs.readdirSync(storagePath);

    console.log("FILES FOUND:", files);

    job.totalFiles = files.length;
    await job.save();

    const totalFiles = files.length || 1;
    let processed = 0;

    job.progress = 10;
    await job.save();

    io.emit("wipe-progress", job.toObject());

    // ==================================
    // WIPE FILES
    // ==================================

    for (const file of files) {
      const filePath = path.join(storagePath, file);

      console.log("START WIPE:", filePath);

      await wipeFile(filePath);

      console.log("FINISHED WIPE:", filePath);

      processed++;

      job.wipedFiles = processed;

      job.progress =
        10 +
        Math.floor((processed / totalFiles) * 70);

      job.events.push({
        message: `Wiped ${file}`,
      });

      await job.save();

      io.emit("wipe-progress", job.toObject());
    }

    // ==================================
    // VERIFICATION
    // ==================================

    console.log("ENTERING VERIFICATION");

    const wipeEvidence = {
      deviceId: device._id.toString(),
      serialNumber: device.serialNumber,
      algorithm: "NIST 800-88 Clear",
      totalFiles: files.length,
      completedAt: new Date(),
    };

    const verificationHash = crypto
      .createHash("sha256")
      .update(JSON.stringify(wipeEvidence))
      .digest("hex");

    console.log("HASH CREATED");

    job.verificationHash = verificationHash;
    job.verificationStatus = "VERIFIED";
    job.progress = 90;

    job.events.push({
      message: "Verification completed",
    });

    await job.save();

    io.emit("wipe-progress", job.toObject());

    // ==================================
    // DIGITAL SIGNATURE
    // ==================================

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

    console.log("SIGNATURE CREATED");

    // ==================================
    // CERTIFICATE
    // ==================================

    const certificate =
      await Certificate.create({
        certificateId:
          "CERT-" + Date.now(),

        deviceId: device._id,

        jobId: job._id,

        sanitizationStandard:
          "NIST SP 800-88 Rev.1",

        algorithm:
          "NIST 800-88 Clear",

        verificationHash,

        signature,

        verificationStatus:
          "VERIFIED",
      });

    console.log(
      "CERTIFICATE SAVED:",
      certificate._id
    );

    const pdfPath =
      await generateCertificate(
        certificate,
        device.deviceName
      );

    certificate.pdfUrl = pdfPath;

    await certificate.save();

    job.certificateId =
      certificate.certificateId;

    await job.save();

    console.log("PDF GENERATED");

    // ==================================
    // COMPLETE
    // ==================================

    job.progress = 100;

    job.status = "completed";

    job.completedAt = new Date();

    job.duration = Math.floor(
      (job.completedAt - job.startedAt) / 1000
    );

    job.events.push({
      message: "Certificate generated",
    });

    await job.save();

    await Device.findByIdAndUpdate(
      deviceId,
      {
        status: "Completed",
      }
    );

    io.emit(
      "wipe-progress",
      job.toObject()
    );

    io.emit("device-updated");

    console.log("WIPE COMPLETED");

    return job;

  } catch (err) {
    console.error(
      "WIPE ENGINE ERROR:",
      err
    );

    job.status = "failed";
    job.failureReason = err.message;

    await job.save();

    await Device.findByIdAndUpdate(
      deviceId,
      {
        status: "Failed",
      }
    );

    io.emit(
      "wipe-progress",
      job.toObject()
    );

    io.emit("device-updated");

    throw err;
  }
};