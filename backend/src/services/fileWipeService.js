import fs from "fs";
import crypto from "crypto";

const CHUNK_SIZE = 1024 * 1024; // 1MB

const overwritePass = (fd, size, pattern) => {
  let offset = 0;

  while (offset < size) {
    const remaining = size - offset;

    const chunk = Math.min(
      CHUNK_SIZE,
      remaining
    );

    let buffer;

    switch (pattern) {
      case "random":
        buffer =
          crypto.randomBytes(chunk);
        break;

      case "zero":
        buffer = Buffer.alloc(
          chunk,
          0x00
        );
        break;

      default:
        buffer = Buffer.alloc(
          chunk,
          0x00
        );
    }

    fs.writeSync(
      fd,
      buffer,
      0,
      chunk,
      offset
    );

    offset += chunk;
  }

  fs.fsyncSync(fd);
};

export const wipeFile = async (
  filePath
) => {
  if (!fs.existsSync(filePath)) {
    throw new Error(
      `File not found: ${filePath}`
    );
  }

  const stats =
    fs.statSync(filePath);

  const size = stats.size;

  const fd = fs.openSync(
    filePath,
    "r+"
  );

  try {
    console.log(
      `Wiping ${filePath}`
    );

    // Pass 1 Random
    overwritePass(
      fd,
      size,
      "random"
    );

    // Pass 2 Zero Fill
    overwritePass(
      fd,
      size,
      "zero"
    );

    fs.closeSync(fd);

    // Delete file
    fs.unlinkSync(filePath);

    return {
      success: true,
      filePath,
    };
  } catch (err) {
    fs.closeSync(fd);

    return {
      success: false,
      filePath,
      error: err.message,
    };
  }
};