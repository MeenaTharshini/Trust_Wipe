import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    certificateId: {
      type: String,
      unique: true,
      required: true,
    },

    deviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Device",
      required: true,
    },

    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WipeJob",
      required: true,
    },

    algorithm: {
      type: String,
      default: "RSA-SHA256",
    },

    signature: {
      type: String,
      default: "",
    },

    verificationStatus: {
      type: String,
      default: "VERIFIED",
    },

    pdfUrl: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Certificate",
  certificateSchema
);