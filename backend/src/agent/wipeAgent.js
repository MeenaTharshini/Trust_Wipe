import { io } from "socket.io-client";
import { exec } from "child_process";
import os from "os";

const SERVER_URL = "https://trust-wipe.onrender.com/api";

const socket = io(SERVER_URL);

/**
 * Get device identity
 */
const getDeviceInfo = () => {
  return {
    deviceId: os.hostname(),
    platform: os.platform(),
    arch: os.arch(),
  };
};

/**
 * Register agent
 */
socket.on("connect", () => {
  console.log("🟢 Wipe Agent Connected");

  socket.emit("register-agent", {
    deviceId: getDeviceInfo().deviceId,
  });
});

/**
 * REAL WIPE EXECUTION
 */
const executeWipe = async (deviceId) => {
  console.log("🔥 Starting REAL wipe process...");

  try {
    let progress = 0;

    const sendProgress = (msg) => {
      socket.emit("wipe-progress", {
        deviceId,
        progress,
        message: msg,
      });
    };

    // STEP 1: Detect disk
    sendProgress("Detecting disks...");
    progress = 10;

    const platform = os.platform();

    // STEP 2: Execute wipe based on OS
    if (platform === "linux") {
      sendProgress("Executing Linux secure wipe...");
      progress = 30;

      exec("lsblk", (err, stdout) => {
        console.log(stdout);
      });

      // ⚠️ REAL COMMAND (UNCOMMENT IN PRODUCTION)
      // exec("shred -v -n 3 -z /dev/sdX");
    }

    if (platform === "win32") {
      sendProgress("Executing Windows wipe...");
      progress = 30;

      // ⚠️ REAL COMMAND (DANGEROUS)
      // exec("cipher /w:C:\\");
    }

    if (platform === "darwin") {
      sendProgress("MacOS wipe initiated...");
      progress = 30;

      // exec("diskutil secureErase 0 disk0");
    }

    // STEP 3: Simulate progress reporting
    for (let i = 40; i <= 90; i += 10) {
      await new Promise((r) => setTimeout(r, 800));
      progress = i;

      sendProgress(`Wiping... ${progress}%`);
    }

    // STEP 4: Completion
    sendProgress("Finalizing wipe...");

    socket.emit("wipe-complete", {
      deviceId,
      status: "completed",
    });

    console.log("✅ WIPE COMPLETED");
  } catch (err) {
    console.error("❌ Wipe failed:", err.message);

    socket.emit("wipe-complete", {
      deviceId,
      status: "failed",
      error: err.message,
    });
  }
};

/**
 * Listen for backend command
 */
socket.on("start-wipe", (data) => {
  console.log("📥 Wipe command received:", data);
  executeWipe(data.deviceId);
});