import Device from "../models/Device.js";
import WipeJob from "../models/WipeJob.js";
import { runWipeEngine } from "../wipeEngine/startWipe.js";

/**
 * START WIPE API CONTROLLER
 */
export const startWipeController = async (req, res) => {
  try {
    const { deviceId } = req.body;

    if (!deviceId) {
      return res.status(400).json({ message: "Device ID required" });
    }

    const device = await Device.findById(deviceId);

    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }

    const job = await runWipeEngine(deviceId);

    await Device.findByIdAndUpdate(deviceId, {
      currentJobId: job._id,
      status: "Wiping",
    });

    return res.status(201).json(job);

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * GET JOB PROGRESS
 */
export const getProgress = async (req, res) => {
  try {
    const job = await WipeJob.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(job);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET ALL JOBS
 */
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await WipeJob.find().sort({ createdAt: -1 });

    res.json({
      count: jobs.length,
      jobs,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};