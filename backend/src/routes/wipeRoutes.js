import express from "express";
import {
  startWipeController,
  getProgress,
  getAllJobs
} from "../controllers/wipeController.js";

const router = express.Router();

// create job
router.post("/start", startWipeController);

// get single job
router.get("/:jobId", getProgress);

// get all jobs (NEW)
router.get("/", getAllJobs);

export default router;