import { Server } from "socket.io";

let io;

/**
 * Initialize Socket.IO server
 */
export const initAgentClient = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 AGENT CONNECTED:", socket.id);

    /**
     * Agent registers itself
     */
    socket.on("register-agent", (data) => {
      socket.join(data.deviceId);
      console.log("📡 Agent registered:", data.deviceId);
    });

    /**
     * Agent sends wipe progress
     */
    socket.on("wipe-progress", (data) => {
      console.log("📊 Progress:", data);
      io.to(data.deviceId).emit("wipe-progress", data);
    });

    /**
     * Agent sends completion
     */
    socket.on("wipe-complete", (data) => {
      console.log("✅ Wipe complete:", data);
      io.to(data.deviceId).emit("wipe-complete", data);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Agent disconnected:", socket.id);
    });
  });

  return io;
};

/**
 * Send wipe command to agent
 */
export const sendWipeCommand = (deviceId, payload) => {
  if (!io) throw new Error("Agent client not initialized");

  io.to(deviceId).emit("start-wipe", payload);
};