import express from "express";

import {
  addDevice,
  getDevices,
  getDeviceById,
  updateDevice,
  deleteDevice,
} from "../controllers/deviceController.js";

const router = express.Router();

// Create Device
router.post("/", addDevice);

// Get All Devices
router.get("/", getDevices);

// Get Single Device
router.get("/:id", getDeviceById);

// Update Device
router.put("/:id", updateDevice);

// Delete Device
router.delete("/:id", deleteDevice);

export default router;