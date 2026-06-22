import Device from "../models/Device.js";

// CREATE DEVICE
export const addDevice = async (req, res) => {
  try {
    const device = await Device.create({
      deviceName: req.body.deviceName,
      serialNumber: req.body.serialNumber,
      storageType: req.body.storageType,
      capacity: req.body.capacity,
      location: req.body.location,
      status: "Pending",
    });

    res.status(201).json(device);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// GET ALL DEVICES
export const getDevices = async (req, res) => {
  try {
    const devices = await Device.find().sort({
      createdAt: -1,
    });

    res.json(devices);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// GET DEVICE BY ID
export const getDeviceById = async (req, res) => {
  try {
    const device = await Device.findById(req.params.id);

    if (!device) {
      return res.status(404).json({
        success: false,
        message: "Device not found",
      });
    }

    res.json(device);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// UPDATE DEVICE
export const updateDevice = async (req, res) => {
  try {
    const device = await Device.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!device) {
      return res.status(404).json({
        success: false,
        message: "Device not found",
      });
    }

    res.json(device);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// DELETE DEVICE
export const deleteDevice = async (req, res) => {
  try {
    const device = await Device.findByIdAndDelete(
      req.params.id
    );

    if (!device) {
      return res.status(404).json({
        success: false,
        message: "Device not found",
      });
    }

    res.json({
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