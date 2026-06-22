import { generateKeyPairSync } from "crypto";
import fs from "fs";

const { publicKey, privateKey } = generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: "spki",
    format: "pem",
  },
  privateKeyEncoding: {
    type: "pkcs8",
    format: "pem",
  },
});

fs.writeFileSync("private.pem", privateKey);
fs.writeFileSync("public.pem", publicKey);

console.log("✅ Keys generated successfully");