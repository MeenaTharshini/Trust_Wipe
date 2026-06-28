import { runWipeEngine } from "./wipeEngine.js";

export const startWipe = async (deviceId) => {
  return await runWipeEngine(deviceId);
};