import WipeJob from "../models/WipeJob.js";
import Device from "../models/Device.js";
import { getIO } from "../socket/index.js";
import Certificate from "../models/Certificate.js";
import crypto from "crypto";
/**
 * CORE WIPE ENGINE (NOT CONTROLLER)
 * This runs the actual wipe simulation + job lifecycle
 */
export const runWipeEngine = async (deviceId) => {
  const io = getIO();

  if (!deviceId) {
    throw new Error("Device ID is required");
  }

  // 🔴 Prevent duplicate running jobs
  const existingJob = await WipeJob.findOne({
    deviceId,
    status: "running",
  });

  if (existingJob) {
    throw new Error("Wipe already running for this device");
  }

  // 🟢 Create new job
  const job = await WipeJob.create({
    deviceId,
    progress: 0,
    status: "running",
    startedAt: new Date(),
  });

  // 🟢 Update device state
  await Device.findByIdAndUpdate(deviceId, {
    status: "Wiping",
    currentJobId: job._id,
  });

  io.emit("device-updated");
  io.emit("wipe-progress", job);

  let progress = 0;

  // 🟢 Simulated wipe process
  const interval = setInterval(async () => {
    try {
      progress += 10;

      job.progress = progress;
      await job.save();

      io.emit("wipe-progress", job);

      // 🟡 Completion condition
      if (progress >= 100) {
  clearInterval(interval);

  job.progress = 100;
  job.status = "completed";
  job.completedAt = new Date();

  await job.save();

  await Device.findByIdAndUpdate(deviceId, {
    status: "Completed",
  });

  // ==========================
  // CREATE CERTIFICATE
  // ==========================

  const certificateId =
    "CERT-" + Date.now();

  const signature =
    crypto
      .createHash("sha256")
      .update(job._id.toString())
      .digest("hex");

  await Certificate.create({
    certificateId,
    deviceId,
    jobId: job._id,
    algorithm: "RSA-SHA256",
    signature,
    verificationStatus: "VERIFIED",
  });

  console.log(
    "✅ Certificate Created"
  );

  io.emit("wipe-progress", job);
  io.emit("device-updated");
}
    } catch (err) {
      clearInterval(interval);

      job.status = "failed";
      await job.save();

      io.emit("wipe-progress", job);

      console.error("Wipe Engine Error:", err.message);
    }
  }, 1000);

  return job;
};