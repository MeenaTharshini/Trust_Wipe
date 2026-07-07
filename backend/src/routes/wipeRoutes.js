// backend/src/routes/wipeRoutes.js
import express from "express";
import {
  startWipeController,
  getAllJobs,
  getJobById,
} from "../controllers/wipeController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * Start a new wipe job
 * POST /api/wipe/start
 */
router.post("/start", authMiddleware, startWipeController);

/**
 * Get all wipe jobs
 * GET /api/wipe
 */
router.get("/", authMiddleware, getAllJobs);

/**
 * Get a single wipe job by ID
 * GET /api/wipe/:jobId
 */
router.get("/:jobId", authMiddleware, getJobById);

export default router;
