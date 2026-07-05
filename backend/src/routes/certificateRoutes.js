import express from "express";

import {
  generateCertificate,
  verifyCertificate
} from "../controllers/certificateController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router =
  express.Router();

router.get(
  "/generate/:certificateId",
  authMiddleware,
  generateCertificate
);

router.get(
  "/verify/:certificateId",
  verifyCertificate
);

export default router;