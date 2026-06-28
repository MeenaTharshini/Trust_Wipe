import Device from "../models/Device.js";
import fs from "fs";
import path from "path";

// CREATE DEVICE (FIXED)
export const createDevice = async (req, res) => {
  try {
    const { deviceName, serialNumber, storageType, capacity, location } = req.body;

    const storagePath = path.join(
      process.cwd(),
      "src/storage",
      `device-${serialNumber}`
    );

    // create folder for wipe engine
    if (!fs.existsSync(storagePath)) {
      fs.mkdirSync(storagePath, { recursive: true });
    }

    const device = await Device.create({
      deviceName,
      serialNumber,
      storageType,
      capacity,
      location,
      storagePath,
      status: "Pending",
    });

    res.status(201).json(device);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET DEVICES
export const getDevices = async (req, res) => {
  try {
    const devices = await Device.find().sort({ createdAt: -1 });
    res.json(devices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE DEVICE (FIXED)
export const deleteDevice = async (req, res) => {
  try {
    const { id } = req.params;

    const device = await Device.findByIdAndDelete(id);

    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }

    // optionally remove storage folder
    if (device.storagePath && fs.existsSync(device.storagePath)) {
      fs.rmSync(device.storagePath, { recursive: true, force: true });
    }

    res.json({ message: "Device deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};