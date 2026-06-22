import express from "express";

import {
  generateCertificate,
  verifyCertificate
} from "../controllers/certificateController.js";

const router =
  express.Router();

router.get(
  "/generate/:certificateId",
  generateCertificate
);

router.get(
  "/verify/:certificateId",
  verifyCertificate
);

export default router;