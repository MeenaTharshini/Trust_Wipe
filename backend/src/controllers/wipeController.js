import Device from "../models/Device.js";
import WipeJob from "../models/WipeJob.js";
import { startWipe } from "../wipeEngine/startWipe.js";

export const startWipeController = async (req, res) => {
  try {
    const { deviceId } = req.body;

    if (!deviceId) {
      return res.status(400).json({
        message: "deviceId required",
      });
    }

    const device = await Device.findById(deviceId);

    if (!device) {
      return res.status(404).json({
        message: "Device not found",
      });
    }

    const job = await startWipe(deviceId);

    return res.status(201).json(job);

  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await WipeJob.find()
      .populate("deviceId")
      .sort({ createdAt: -1 });

    return res.json(jobs);

  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};