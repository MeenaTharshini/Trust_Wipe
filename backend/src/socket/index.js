// backend/src/socket/index.js

import { Server } from "socket.io";
import { setSocket, resolvePendingDiscovery } from "./agentBridge.js";

import WipeJob from "../models/WipeJob.js";
import Device from "../models/Device.js";
import { generateCertificate } from "../certificateEngine/generateCertificate.js";
import Certificate from "../models/Certificate.js";
let io;

// deviceId -> agentInfo
const connectedAgents = new Map();

export const initAgentClient = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  setSocket(io);

  io.on("connection", (socket) => {
    console.log("🟢 Socket Connected:", socket.id);

    /*
    =====================================================
    REGISTER AGENT
    =====================================================
    */
    socket.on("register-agent", (agent) => {
      if (!agent?.deviceId) return;

      const info = {
        socketId: socket.id,
        deviceId: agent.deviceId,
        hostname: agent.hostname || "unknown",
        username: agent.username || "",
        platform: agent.platform || "",
        arch: agent.arch || "",
        status: "online",
        lastSeen: new Date(),
      };

      connectedAgents.set(agent.deviceId, info);

      socket.join(`agent:${agent.deviceId}`);

      console.log("✅ Agent Registered:", agent.deviceId);

      io.emit("agent-status", {
        deviceId: agent.deviceId,
        status: "online",
      });
    });

    /*
    =====================================================
    DRIVE DISCOVERY
    =====================================================
    */
    socket.on("drive-list", (data) => {
      resolvePendingDiscovery(data.userId, data);
    });

    /*
    =====================================================
    WIPE PROGRESS
    =====================================================
    */
    socket.on("wipe-progress", async (data) => {
      try {
        const job = await WipeJob.findByIdAndUpdate(
          data.commandId,
          {
            progress: data.progress,
            status: "running",
            $push: {
              events: {
                message: data.message,
                timestamp: new Date(),
              },
            },
          },
          { new: true }
        );

        io.emit("wipe-progress", job || data);
      } catch (err) {
        console.error("wipe-progress error:", err.message);
      }
    });

    /*
    =====================================================
    WIPE COMPLETE
    =====================================================
    */
socket.on("wipe-complete", async (data) => {
  try {

    const job = await WipeJob.findByIdAndUpdate(
      data.commandId,
      {
        progress: 100,
        status: data.status,
        completedAt: new Date(),
        wipedFiles:data.wipedFiles,

        verifiedFiles:data.verifiedFiles,

        verificationFailures:data.verificationFailures,

        verificationHash:data.verificationHash,

        verificationEvidenceHash:data.verificationEvidenceHash,
        $push: {
          events: {
            message: `Job ${data.status}`,
            timestamp: new Date(),
          },
        },
      },
      {
        returnDocument: "after",
      }
    );

    if (!job) {
      console.log("Job not found");
      return;
    }

    // ---------------------------------
    // Update Device
    // ---------------------------------

    await Device.findByIdAndUpdate(
      job.deviceId,
      {
        status:
          data.status === "completed"
            ? "Completed"
            : data.status === "failed"
            ? "Failed"
            : "Pending",

        currentJobId: null,

        // Keep reference for verification
        lastJobId: job._id,
      },
      {
        returnDocument: "after",
      }
    );

    // ---------------------------------
    // Generate Certificate
    // ---------------------------------

    if (data.status === "completed") {
  try {
    // Get device
    const device = await Device.findById(job.deviceId);

    if (!device) {
      throw new Error("Device not found");
    }

    // Create certificate document
    const certificate = await Certificate.create({
      certificateId: `TW-${Date.now()}`,

      deviceId: device._id,
      jobId: job._id,

      manufacturer: device.manufacturer || "",
      modelNumber: device.modelNumber || "",
      owner: device.owner,
      location: device.location || "",
      deviceType: device.storageType || "",
      storagePath: device.storagePath || "",

      sanitizationStandard: "NIST SP 800-88 Rev.1",
      algorithm: job.algorithm,

      verificationMethod: job.verificationMethod,
      verificationHash: job.verificationHash,
      verificationEvidenceHash:
        job.verificationEvidenceHash,

      verificationStatus: "VERIFIED",

      wipedFiles: job.wipedFiles,
      verifiedFiles: job.verifiedFiles,
      verificationFailures:
        job.verificationFailures,

      wipeCompletedAt: job.completedAt,

      signature:
        "TrustWipe Digital Signature",
    });

    // Generate PDF
    const pdfPath = await generateCertificate(
      certificate,
      device
    );

    // Save pdf path
    certificate.pdfUrl = pdfPath;
    await certificate.save();

    // Save certificate id inside wipe job
    job.certificateId = certificate.certificateId;
    await job.save();

    console.log(
      "Certificate Generated:",
      certificate.certificateId
    );
  } catch (err) {
    console.error(
      "Certificate Generation Failed:",
      err
    );
  }
}

    // ---------------------------------
    // Notify Frontend
    // ---------------------------------

    io.emit("wipe-complete", job);

    io.emit("device-updated", {
      deviceId: job.deviceId,
      status:
        data.status === "completed"
          ? "Completed"
          : data.status === "failed"
          ? "Failed"
          : "Pending",

      jobId: job._id,
    });

  } catch (err) {

    console.error(
      "wipe-complete error:",
      err.message
    );

  }
});

    /*
    =====================================================
    HEARTBEAT
    =====================================================
    */
    socket.on("heartbeat", ({ deviceId }) => {
      const agent = connectedAgents.get(deviceId);

      if (agent) {
        agent.status = "online";
        agent.lastSeen = new Date();
      }
    });

    /*
    =====================================================
    DISCONNECT
    =====================================================
    */
    socket.on("disconnect", () => {
      for (const [deviceId, info] of connectedAgents.entries()) {
        if (info.socketId === socket.id) {
          connectedAgents.delete(deviceId);

          console.log("🔴 Agent Disconnected:", deviceId);

          io.emit("agent-status", {
            deviceId,
            status: "offline",
          });

          break;
        }
      }
    });
  });

  return io;
};

/*
=====================================================
HELPERS
=====================================================
*/

export const getIO = () => {
  if (!io) throw new Error("Socket not initialized");
  return io;
};

export const getConnectedAgents = () => {
  return [...connectedAgents.values()];
};

export const getAgent = (deviceId) => {
  return connectedAgents.get(deviceId) || null;
};

export const isAgentOnline = (deviceId) => {
  return connectedAgents.has(deviceId);
};