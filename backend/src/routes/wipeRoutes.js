import express from "express";
import {
  startWipeController,
  getAllJobs,
} from "../controllers/wipeController.js";

const router = express.Router();

router.post("/start", startWipeController);
router.get("/", getAllJobs);

export default router;