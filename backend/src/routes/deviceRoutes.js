import express from "express";
import {
  autoDiscoverDevices,
  getDevices,
  createDevice,
  deleteDevice,
} from "../controllers/deviceController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
    "/discover",
    authMiddleware,
    autoDiscoverDevices
);

router.post(
  "/",
  authMiddleware,
  createDevice
);

router.delete(
  "/:id",
  authMiddleware,
  deleteDevice
);

router.get(
  "/",
  authMiddleware,
  getDevices
);

export default router;