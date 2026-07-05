import { runWipeEngine } from "./wipeEngine.js";

/**
 * Entry point for starting a wipe job
 * (kept thin intentionally for scalability)
 */
export const startWipe = async (deviceId, userId) => {
  try {
    const result = await runWipeEngine(deviceId, userId);
    return result;
  } catch (error) {
    console.error("startWipe error:", error.message);
    throw error;
  }
};