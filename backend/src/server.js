import express from "express";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

import deviceRoutes from "./routes/deviceRoutes.js";
import wipeRoutes from "./routes/wipeRoutes.js";
import verificationRoutes from "./routes/verificationRoutes.js";
import certificateRoutes from "./routes/certificateRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";

import { initSocket } from "./socket/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, "../.env"),
});

const app = express();
const server = http.createServer(app);

// ================= SOCKET =================
initSocket(server);

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.url}`);
  next();
});

// ================= ROUTES =================
app.use("/api/auth", authRoutes);
app.use("/api/devices", deviceRoutes);
app.use("/api/wipe", wipeRoutes);
app.use("/api/verification", verificationRoutes);
app.use("/api/certificate", certificateRoutes);

// ================= HEALTH CHECK =================
app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});
//==========generatereport=========
app.use("/api/auth", authRoutes);
app.use("/api/devices", deviceRoutes);
app.use("/api/wipe", wipeRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/verification", verificationRoutes);
app.use("/api/reports", reportRoutes);
app.get("/", (req, res) => {
  res.json({
    success: true,
    application: "TrustWipe Enterprise API",
    version: "1.0.0",
    status: "Running",
    endpoints: {
      auth: "/api/auth",
      devices: "/api/devices",
      wipe: "/api/wipe",
      certificates: "/api/certificate",
      verification: "/api/verification",
      reports: "/api/reports",
      health: "/api/health",
    },
  });
});
// ================= 404 =================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error("🔥 ERROR:", err);
  res.status(500).json({
    success: false,
    message: err.message,
  });
});

app.post("/test", (req, res) => {
  console.log("TEST HIT", req.body);
  res.json({ ok: true });
});

// ================= DB =================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    server.listen(process.env.PORT || 5000, () => {
      console.log("🚀 TrustWipe running");
    });
  })
  .catch((err) => {
    console.error("❌ DB ERROR:", err);
  });