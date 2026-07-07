// agent/core/socketClient.js
import { io } from "socket.io-client";
import os from "os";

import { runDriveDiscovery } from "./systemEngine.js";
import { startWipeTask, cancelWipeTask } from "./taskEngine.js";

const SERVER_URL = "http://localhost:5000";

const socket = io(SERVER_URL, {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: Infinity,
  timeout: 10000,
});

const AGENT_ID = process.env.AGENT_ID || os.hostname();

/* =====================================================
   CONNECT
===================================================== */
socket.on("connect", () => {
  console.log("🟢 Connected to TrustWipe Server");

  socket.emit("register-agent", {
    deviceId: AGENT_ID, // MUST match Device.agentId in DB
    hostname: os.hostname(),
    platform: os.platform(),
    arch: os.arch(),
    username: os.userInfo().username,
    connectedAt: new Date(),
  });
});

/* =====================================================
   DISCONNECT
===================================================== */
socket.on("disconnect", (reason) => {
  console.log("🔴 Disconnected:", reason);
});

/* =====================================================
   CONNECT ERROR
===================================================== */
socket.on("connect_error", (err) => {
  console.error("❌ Socket Error:", err.message);
});

/* =====================================================
   HEARTBEAT
===================================================== */
setInterval(() => {
  if (socket.connected) {
    socket.emit("heartbeat", {
      deviceId: AGENT_ID,
      timestamp: new Date(),
    });
  }
}, 30000);

/* =====================================================
   DRIVE DISCOVERY
===================================================== */
socket.on("discover-drives", async (payload) => {
  console.log("📀 Drive discovery requested for userId:", payload.userId);

  try {
    const drives = await runDriveDiscovery();

    console.log("Discovered Drives:", JSON.stringify(drives, null, 2));
    console.log("📤 Sending drive-list for userId:", payload.userId);

    socket.emit("drive-list", {
      deviceId: AGENT_ID,
      userId: payload.userId,
      drives,
    });

    console.log("📤 Drive list sent");
  } catch (err) {
    console.error("❌ Drive discovery failed:", err.message);

    socket.emit("drive-list", {
      deviceId: AGENT_ID,
      userId: payload.userId,
      drives: [],
      error: err.message,
    });
  }
});

/* =====================================================
   START WIPE
===================================================== */
socket.on("start-wipe", (job) => {
  console.log("▶ Start wipe:", job.commandId);
  startWipeTask(socket, job);
});

/* =====================================================
   CANCEL WIPE
===================================================== */
socket.on("cancel-wipe", (job) => {
  console.log("⛔ Cancel wipe:", job.commandId);
  cancelWipeTask(job.commandId);
});

export default socket;
