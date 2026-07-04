import fs from "fs";
import crypto from "crypto";

const CHUNK_SIZE = 1024 * 1024;

const overwritePass = (
  fd,
  size,
  pattern
) => {

  let offset = 0;

  while (offset < size) {

    const remaining =
      size - offset;

    const chunk =
      Math.min(
        CHUNK_SIZE,
        remaining
      );

    let buffer;

    switch (pattern) {

      case "zero":
        buffer = Buffer.alloc(
          chunk,
          0x00
        );
        break;

      case "random":
        buffer =
          crypto.randomBytes(
            chunk
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

  const stats =
    fs.statSync(filePath);

  const size =
    stats.size;

  const fd =
    fs.openSync(filePath, "r+");

  // NIST Clear
  overwritePass(
    fd,
    size,
    "random"
  );

  overwritePass(
    fd,
    size,
    "zero"
  );
  fs.closeSync(fd);

  return true;
};