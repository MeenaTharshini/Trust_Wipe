import fs from "fs";
import crypto from "crypto";

export const verifyFile = (
  filePath
) => {

  try {

    if (!fs.existsSync(filePath)) {
      return {
        verified: false,
        reason: "File Missing",
      };
    }

    const data =
      fs.readFileSync(filePath);

    const hash =
      crypto
        .createHash("sha256")
        .update(data)
        .digest("hex");

    let allZero = true;

    for (const byte of data) {

      if (byte !== 0) {
        allZero = false;
        break;
      }

    }

    return {
      verified: allZero,
      hash,
      size: data.length,
    };

  } catch (err) {

    return {
      verified: false,
      reason: err.message,
    };

  }

};