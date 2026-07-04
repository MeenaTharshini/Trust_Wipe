import Device from "../models/Device.js";

// CREATE DEVICE
export const createDevice = async (req, res) => {
  try {
    const {
      deviceName,
      serialNumber,
      storageType,
      capacity,
      location,
    } = req.body;

    const device = await Device.create({
      deviceName,
      serialNumber,
      storageType,
      capacity,
      location,

      files: [
        {
          fileName: "employee_records.db",
          fileSize: "2.4 GB",
        },
        {
          fileName: "finance_backup.zip",
          fileSize: "5.7 GB",
        },
        {
          fileName: "customer_data.xlsx",
          fileSize: "350 MB",
        },
        {
          fileName: "archive_2025.tar",
          fileSize: "1.1 GB",
        },
      ],

      status: "Pending",
    });

    res.status(201).json(device);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// GET DEVICES
export const getDevices = async (req, res) => {
  try {
    const devices = await Device.find().sort({
      createdAt: -1,
    });

    res.json(devices);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// DELETE DEVICE
export const deleteDevice = async (req, res) => {
  try {
    const device =
      await Device.findByIdAndDelete(
        req.params.id
      );

    if (!device) {
      return res.status(404).json({
        message: "Device not found",
      });
    }

    res.json({
      message: "Device deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};