import express from "express";
import {
  startWipeController,
  getAllJobs,
} from "../controllers/wipeController.js";


import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();
router.post(
  "/start",
  authMiddleware,
  startWipeController
);

router.get(
  "/",
  authMiddleware,
  getAllJobs
);

export default router;