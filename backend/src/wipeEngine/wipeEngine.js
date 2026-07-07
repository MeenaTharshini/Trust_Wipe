// backend/src/wipeEngine/wipeEngine.js
import Device from "../models/Device.js";
import WipeJob from "../models/WipeJob.js";
import { getSocket } from "../socket/agentBridge.js";
import {
  getAgent,
  getConnectedAgents,
} from "../socket/index.js";/**
 * Orchestrates a wipe job by dispatching to the agent
 */
export const runWipeEngine = async (deviceId, userId) => {
  const io = getSocket();

  // 1. Load device
  const device = await Device.findById(deviceId);
  if (!device) throw new Error("Device not found");

  // 2. Find agent (must match agentId registered by wipeAgent.js)
  const agentId = device.agentId;

console.log("================================");
console.log("Device agentId:", agentId);
console.log("Device:");
console.log(device);

console.log("Connected Agents:");
console.log(getConnectedAgents());

const agent = getAgent(agentId);

console.log("Found Agent:", agent);
console.log("================================");

if (!agent) {
  throw new Error("Agent offline");
}

  // 3. Ensure no active job
  const runningJob = await WipeJob.findOne({ deviceId, status: "running" });
  if (runningJob) throw new Error("A wipe job is already running.");

  // 4. Create job record
  const job = await WipeJob.create({
    deviceId,
    owner: userId,
    algorithm: "NIST SP 800-88 Rev.1",
    status: "running",
    progress: 0,
    verificationStatus: "Pending",
    events: [
      { message: "Dispatching wipe command to agent", createdAt: new Date() },
    ],
    startedAt: new Date(),
  });

  // 5. Update device
  device.status = "Wiping";
  device.currentJobId = job._id;
  await device.save();

  // 6. Notify frontend
  io.emit("device-updated", { deviceId: device._id, status: device.status,jobId:job._id });
  io.emit("wipe-progress", job);

  // 7. Dispatch wipe command to agent ROOM
  io.to(`agent:${agent.deviceId}`).emit("start-wipe", {
    commandId: job._id.toString(),
    deviceId,
    userId,
    storagePath: device.storagePath,
    algorithm: job.algorithm,
    issuedAt: new Date(),
  });

  console.log(`🚀 Wipe job ${job._id} dispatched to agent ${agent.deviceId}`);

  return job;
};
