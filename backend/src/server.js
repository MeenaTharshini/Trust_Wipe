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

import { initSocket } from "./socket/index.js";

// ========================
// ENV CONFIG
// ========================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, "../.env"),
});

// DEBUG
console.log("PORT =", process.env.PORT);
console.log("MONGO_URI =", process.env.MONGO_URI);

// ========================
// EXPRESS APP
// ========================

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.url}`);
  next();
});

// ========================
// ROUTES
// ========================

app.use("/api/devices", deviceRoutes);
app.use("/api/wipe", wipeRoutes);
app.use("/api/verification", verificationRoutes);
app.use("/api/certificate", certificateRoutes);

// ========================
// 404 HANDLER
// ========================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ========================
// ERROR HANDLER
// ========================

app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

// ========================
// SERVER + SOCKET
// ========================

const server = http.createServer(app);

initSocket(server);

// ========================
// MONGODB CONNECTION
// ========================

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI missing in .env");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    const PORT = process.env.PORT || 5000;

    server.listen(PORT, () => {
      console.log(
        `🚀 TrustWipe running on port ${PORT}`
      );
    });
  })
  .catch((err) => {
    console.error(
      "❌ MongoDB Connection Failed:",
      err.message
    );
  });