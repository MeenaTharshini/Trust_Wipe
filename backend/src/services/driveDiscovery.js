// backend/src/services/driveDiscovery.js

import {
  getSocket,
  addPendingDiscovery,
  removePendingDiscovery,
} from "../socket/agentBridge.js";

import { getConnectedAgents } from "../socket/index.js";

/**
 * ==========================================
 * API Controller
 * ==========================================
 */
export const discoverDrives = async (req, res) => {
  try {
    const result = await requestDriveDiscovery(req.user.id);

    return res.status(200).json(result);
  } catch (err) {
    console.error("Drive Discovery Error:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * ==========================================
 * Request Drive Discovery
 * ==========================================
 */
export const requestDriveDiscovery = async (userId) => {
  const io = getSocket();
  const agents = getConnectedAgents();

  console.log("====================================");
  console.log("CONNECTED AGENTS");
  console.table(agents);
  console.log("====================================");

  if (!agents.length) {
    throw new Error("No TrustWipe Agent Connected");
  }

  const agent = agents[0];

  console.log("Using Agent:", agent.deviceId);

  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      console.warn("Drive discovery timed out.");

      removePendingDiscovery(userId);

      resolve({
        success: false,
        devices: [],
        message: "Agent timeout",
      });
    }, 10000);

    addPendingDiscovery(userId, (payload) => {
      clearTimeout(timeout);

      removePendingDiscovery(userId);

      console.log("============== AGENT RESPONSE ==============");
      console.log(JSON.stringify(payload, null, 2));
      console.log("============================================");

      if (!payload) {
        return resolve({
          success: false,
          devices: [],
          message: "Empty response from agent",
        });
      }

      if (!Array.isArray(payload.drives)) {
        return resolve({
          success: false,
          devices: [],
          message: "Invalid drive list received",
        });
      }

      const devices = payload.drives.map((drive) => ({
        ...drive,

        // IMPORTANT
        agentId: payload.deviceId,

        discoveredAt: new Date(),
      }));

      console.log("Returning Drives:");
      console.table(devices);

      resolve({
        success: true,
        devices,
        message: `${devices.length} drive(s) discovered`,
      });
    });

    console.log(
      `Sending discover-drives -> agent:${agent.deviceId}`
    );

    io.to(`agent:${agent.deviceId}`).emit("discover-drives", {
      userId,
    });
  });
};