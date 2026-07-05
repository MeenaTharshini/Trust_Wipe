import Device from "../models/Device.js";
import { discoverDrives } from "../services/driveDiscovery.js";

// =====================================
// AUTO DISCOVER DRIVES
// =====================================

export const autoDiscoverDevices = async (req, res) => {
  try {
    const drives = await discoverDrives();

    const formattedDrives = drives.map((drive, index) => ({
      deviceName: drive.deviceName || `Drive ${index}`,
      serialNumber:
        drive.mount ||
        drive.serialNumber ||
        `AUTO-${Date.now()}-${index}`,
      storageType: drive.storageType || "Unknown",
      capacity: drive.capacity || "Unknown",
      location: "",
      status: "Pending",
    }));

    res.status(200).json({
      success: true,
      message: "Drives discovered successfully",
      devices: formattedDrives,
    });
  } catch (err) {
    console.error("DISCOVERY ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =====================================
// CREATE DEVICE
// =====================================

export const createDevice = async (req, res) => {
  try {
    const {
      deviceName,
      serialNumber,
      storageType,
      capacity,
      location,
      manufacturer,
      modelNumber,
      deviceType,
      storagePath,
    } = req.body;

    

    const device = await Device.create({
      owner: req.user.id,

      deviceName,
      serialNumber,
      storageType,
      capacity,
      location,
      manufacturer,
      modelNumber,
      deviceType,
      storagePath,

      files: [
        {
          fileName: storagePath
            ? storagePath.split("\\").pop()
            : "Unknown",

          fileSize: "Unknown",

          path: storagePath,

          status: "Pending",
        },
      ],
      status: "Pending",
    });

    res.status(201).json({
      success: true,
      device,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =====================================
// GET ALL DEVICES
// =====================================

export const getDevices = async (req, res) => {
  try {
    const ownerId = req.user.id;

if (!ownerId) {
  return res.status(401).json({ message: "Unauthorized" });
}

const devices = await Device.find({ owner: ownerId }).sort({ createdAt: -1 });

    res.status(200).json(devices);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =====================================
// GET DEVICE BY ID
// =====================================

export const getDeviceById = async (req, res) => {
  try {
    const device = await Device.findOne({
  _id: req.params.id,
  owner: req.user.id,
});
    if (!device) {
      return res.status(404).json({
        success: false,
        message: "Device not found",
      });
    }

    res.status(200).json(device);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =====================================
// UPDATE DEVICE
// =====================================

export const updateDevice = async (req, res) => {
  try {
    const device =
 await Device.findOneAndUpdate(
   {
     _id: req.params.id,
     owner: req.user.id,
   },
   req.body,
   {
     new: true,
   }
 );

    if (!device) {
      return res.status(404).json({
        success: false,
        message: "Device not found",
      });
    }

    res.status(200).json({
      success: true,
      device,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =====================================
// DELETE DEVICE
// =====================================

export const deleteDevice = async (req, res) => {
  try {
    const device = await Device.findOneAndDelete({
  _id: req.params.id,
  owner: req.user.id,
});

if (!device) {
  return res.status(404).json({
    success: false,
    message: "Device not found",
  });
}

    res.status(200).json({
      success: true,
      message: "Device deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};