// backend/src/socket/agentClient.js
import { Server } from "socket.io";
import { setSocket, resolvePendingDiscovery } from "../socket/agentBridge.js";

let io;

/*
==================================================
CONNECTED AGENTS
deviceId -> agent information
==================================================
*/
const connectedAgents = new Map();

/*
==================================================
INITIALIZE SOCKET SERVER
==================================================
*/


/*
==================================================
SEND COMMAND TO SPECIFIC AGENT
==================================================
*/
export const sendCommandToAgent = (deviceId, command, payload = {}) => {
  if (!io) throw new Error("Socket.IO not initialized");

  const agent = connectedAgents.get(deviceId);
  if (!agent) {
    console.error("❌ Agent not found:", deviceId);
    return false;
  }

  io.to(`agent:${deviceId}`).emit(command, payload);
  console.log(`📤 Sent '${command}' to agent ${deviceId}`);

  return true;
};

/*
==================================================
GET ALL CONNECTED AGENTS
==================================================
*/
export const getConnectedAgents = () => {
  return [...connectedAgents.values()];
};

/*
==================================================
GET SINGLE AGENT
==================================================
*/
export const getAgent = (deviceId) => {
  return connectedAgents.get(deviceId) || null;
};

/*
==================================================
CHECK IF AGENT IS ONLINE
==================================================
*/
export const isAgentOnline = (deviceId) => {
  return connectedAgents.has(deviceId);
};
