import express from "express";

import {
  downloadPDFReport,
  downloadExcelReport,
  downloadComplianceReport,
} from "../controllers/reportController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/* ==========================================
   REPORT ROUTES
========================================== */

router.get(
  "/pdf",
  authMiddleware,
  downloadPDFReport
);

router.get(
  "/excel",
  authMiddleware,
  downloadExcelReport
);

router.get(
  "/compliance",
  authMiddleware,
  downloadComplianceReport
);

export default router;