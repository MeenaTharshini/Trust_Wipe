// backend/src/controllers/wipeController.js
import Device from "../models/Device.js";
import WipeJob from "../models/WipeJob.js";
import { runWipeEngine } from "../wipeEngine/wipeEngine.js";

/**
 * Start a new wipe job
 */
export const startWipeController = async (req, res) => {
  try {
    const { deviceId } = req.body;

    if (!deviceId) {
      return res.status(400).json({ success: false, message: "deviceId required" });
    }

    // 1. Load device
    const device = await Device.findById(deviceId);
    if (!device) {
      return res.status(404).json({ success: false, message: "Device not found" });
    }

    // 2. Run wipe engine (orchestration only)
    const job = await runWipeEngine(deviceId, req.user.id);

    // 3. Return job info
    return res.status(201).json({
      success: true,
      job,
      message: "Wipe job started successfully",
    });
  } catch (err) {
    console.error("START WIPE ERROR:", err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Get all wipe jobs
 */
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await WipeJob.find()
      .populate("deviceId")
      .sort({ createdAt: -1 });

    return res.json({ success: true, jobs });
  } catch (err) {
    console.error("GET JOBS ERROR:", err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Get a single wipe job by ID
 */
export const getJobById = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await WipeJob.findById(jobId).populate("deviceId");

    if (!job) {
      return res.status(404).json({ success: false, message: "Wipe job not found" });
    }

    return res.json({ success: true, job });
  } catch (err) {
    console.error("GET JOB ERROR:", err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
};
// backend/src/controllers/wipeController.js
export const getLatestJobForUser = async (req, res) => {
  try {
    const job = await WipeJob.findOne({ userId: req.user.id })
      .populate("deviceId")
      .sort({ createdAt: -1 });

    if (!job) {
      return res.json({ success: true, job: null });
    }

    return res.json({ success: true, job });
  } catch (err) {
    console.error("GET LATEST JOB ERROR:", err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
};
