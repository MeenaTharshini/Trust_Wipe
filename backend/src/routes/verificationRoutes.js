import express from "express";
import { verifyWipe } from "../controllers/verificationController.js";

const router = express.Router();

router.post("/verify", (req, res, next) => {
    console.log("VERIFY ROUTE HIT");
    next();
}, verifyWipe);

export default router;