import fs from "fs";
import crypto from "crypto";

const CHUNK_SIZE = 1024 * 1024; // 1MB

const overwritePass = async (
  filePath,
  size,
  mode
) => {

  const fd =
    fs.openSync(filePath, "r+");

  let written = 0;

  while (written < size) {

    const remaining =
      size - written;

    const currentChunk =
      Math.min(
        CHUNK_SIZE,
        remaining
      );

    let buffer;

    if (mode === "zero") {

      buffer =
        Buffer.alloc(
          currentChunk,
          0x00
        );

    } else if (
      mode === "ones"
    ) {

      buffer =
        Buffer.alloc(
          currentChunk,
          0xFF
        );

    } else {

      buffer =
        crypto.randomBytes(
          currentChunk
        );
    }

    fs.writeSync(
      fd,
      buffer,
      0,
      currentChunk,
      written
    );

    written += currentChunk;
  }

  fs.fsyncSync(fd);

  fs.closeSync(fd);
};

export const wipeFile = async (
  filePath
) => {

  if (
    !fs.existsSync(filePath)
  ) {
    throw new Error(
      `File not found: ${filePath}`
    );
  }

  const stats =
    fs.statSync(filePath);

  const size =
    stats.size;

  await overwritePass(
    filePath,
    size,
    "zero"
  );

  await overwritePass(
    filePath,
    size,
    "ones"
  );

  await overwritePass(
    filePath,
    size,
    "random"
  );

  fs.unlinkSync(filePath);

  return true;
};