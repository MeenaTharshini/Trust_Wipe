import express from "express";

import {
  verifyWipe
} from "../controllers/verificationController.js";

const router =
  express.Router();

router.post(
  "/verify",
  verifyWipe
);

export default router;