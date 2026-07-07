// backend/src/server.js
import express from "express";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";
import deviceRoutes from "./routes/deviceRoutes.js";
import wipeRoutes from "./routes/wipeRoutes.js";
import verificationRoutes from "./routes/verificationRoutes.js";
import certificateRoutes from "./routes/certificateRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";

import { initAgentClient } from "./socket/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({
  path: path.join(__dirname, "../.env"),
});

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Request logging (non-production only)
if (process.env.NODE_ENV !== "production") {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
}

// Initialize Socket.IO
initAgentClient(server);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/devices", deviceRoutes);
app.use("/api/wipe", wipeRoutes);
app.use("/api/verification", verificationRoutes);
app.use("/api/certificate", certificateRoutes);
app.use("/api/reports", reportRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    application: "TrustWipe Enterprise API",
    version: "1.0.0",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

// Database connection and server start
// Database
mongoose
  .connect(process.env.MONGO_URI) // no extra options needed in Mongoose v7+
  .then(() => {
    console.log("✅ MongoDB Connected");

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`🚀 TrustWipe Server Running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  });

