import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    // Enterprise Certificate Number
    certificateId: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },

    // Device
    deviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Device",
      required: true,
    },

    // Related Wipe Job
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WipeJob",
      required: true,
    },

    // Sanitization Standard
    sanitizationStandard: {
      type: String,
      default: "NIST SP 800-88 Rev.1",
    },

    // Wiping Algorithm
    algorithm: {
      type: String,
      default: "RSA-SHA256",
    },

    // SHA-256 Hash generated during verification
    verificationHash: {
      type: String,
      default: "",
    },

    // Digital Signature
    signature: {
      type: String,
      default: "",
    },

    // Verification Result
    verificationStatus: {
      type: String,
      enum: ["VERIFIED", "FAILED", "PENDING"],
      default: "VERIFIED",
    },

    // User who issued certificate
    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Certificate Issue Date
    issuedAt: {
      type: Date,
      default: Date.now,
    },

    // PDF Storage Path
    pdfUrl: {
      type: String,
      default: "",
    },

    // Certificate Remarks
    remarks: {
      type: String,
      default: "",
    },

    // Certificate Active/Revoked
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Certificate", certificateSchema);