import fs from "fs";

/* =========================
   SAFE WIPE VALIDATION
========================= */

export const validateWipe = (drive) => {
  if (!drive) return false;

  /* BLOCK SYSTEM DRIVES */
  if (drive.role === "SYSTEM") {
    return {
      allowed: false,
      reason: "SYSTEM_DRIVE_PROTECTION",
    };
  }

  return {
    allowed: true,
    reason: "SAFE",
  };
};
export const wipeFile = async (filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      return {
        success: false,
        error: "File not found",
      };
    }

    // Demo implementation
    fs.unlinkSync(filePath);

    return {
      success: true,
    };
  } catch (err) {
    return {
      success: false,
      error: err.message,
    };
  }
};