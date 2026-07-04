import { runWipeEngine } from "./wipeEngine.js";

/**
 * Entry point for starting a wipe job
 * (kept thin intentionally for scalability)
 */
export const startWipe = async (deviceId, options = {}) => {
  try {
    const result = await runWipeEngine(deviceId, options);
    return result;
  } catch (error) {
    console.error("startWipe error:", error.message);
    throw error;
  }
};