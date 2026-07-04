import express from "express";
import {
  autoDiscoverDevices,
  getDevices,
  createDevice,
  deleteDevice,
} from "../controllers/deviceController.js";

const router = express.Router();
router.get("/discover", autoDiscoverDevices);
router.get("/", getDevices);
router.post("/", createDevice);
router.delete("/:id", deleteDevice);

export default router;