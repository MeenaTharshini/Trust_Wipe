import express from "express";
import {
  checkPath,
} from "../controllers/pathVerificationController.js";

const router = express.Router();

router.post("/check", checkPath);

export default router;