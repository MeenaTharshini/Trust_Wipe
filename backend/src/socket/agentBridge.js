/* ==========================================
   backend/src/socket/agentBridge.js
========================================== */

/**
 * Global Socket.IO instance
 */
let ioInstance = null;

/**
 * Pending drive discovery requests
 * Key   : userId
 * Value : callback function
 */
const pendingDiscovery = new Map();

/* =====================================================
   SOCKET INSTANCE MANAGEMENT
===================================================== */

/**
 * Store Socket.IO instance
 */
export const setSocket = (io) => {
  ioInstance = io;
};

/**
 * Get Socket.IO instance
 */
export const getSocket = () => {
  if (!ioInstance) {
    throw new Error("Socket.IO has not been initialized.");
  }
  return ioInstance;
};

/* =====================================================
   DRIVE DISCOVERY CALLBACKS
===================================================== */

/**
 * Register a pending drive discovery callback
 */
export const addPendingDiscovery = (userId, callback) => {
  if (!userId || typeof callback !== "function") {
    throw new Error("Invalid pending discovery registration.");
  }
  pendingDiscovery.set(userId, callback);
};

/**
 * Resolve a pending discovery request
 */
export const resolvePendingDiscovery = (userId, data) => {
  const callback = pendingDiscovery.get(userId);

  if (callback) {
    try {
      callback(data);
    } catch (err) {
      console.error("Discovery callback error:", err.message);
    }
    pendingDiscovery.delete(userId);
  } else {
    console.warn(`No pending discovery found for userId: ${userId}`);
  }
};

/**
 * Remove a pending request (timeout/cancel)
 */
export const removePendingDiscovery = (userId) => {
  if (pendingDiscovery.has(userId)) {
    pendingDiscovery.delete(userId);
    console.log("Pending discoveries:", listPendingDiscovery());

    console.log(`Pending discovery removed for userId: ${userId}`);
  }
};

/**
 * List all pending discovery requests (for debugging)
 */
export const listPendingDiscovery = () => {
  return Array.from(pendingDiscovery.keys());
};
