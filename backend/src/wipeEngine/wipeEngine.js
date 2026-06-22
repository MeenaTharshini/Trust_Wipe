import WipeJob from "../models/WipeJob.js";
import Device from "../models/Device.js";
import { getIO } from "../socket/index.js";

export const startWipe = async (deviceId) => {
  const io = getIO();

  const job = await WipeJob.create({
    deviceId,
    progress: 0,
    status: "running",
  });

  let progress = 0;

  const interval = setInterval(async () => {
    progress += 10;

    job.progress = progress;
    job.status = "running";

    await job.save();

    io.emit("wipe-progress", job);

    // ======================
    // COMPLETION
    // ======================
    if (progress >= 100) {
      clearInterval(interval);

      job.progress = 100;
      job.status = "completed";
      job.completedAt = new Date();

      await job.save();

      // ⭐ CRITICAL FIX: UPDATE DEVICE STATUS
      await Device.findByIdAndUpdate(deviceId, {
        status: "Completed",
      });

      io.emit("wipe-progress", job);
    }
  }, 1000);

  return job;
};