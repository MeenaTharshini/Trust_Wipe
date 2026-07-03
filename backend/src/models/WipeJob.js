import mongoose from "mongoose";

const wipeJobSchema = new mongoose.Schema(
  {
    deviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Device",
      required: true,
    },

    initiatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    algorithm: {
      type: String,
      default: "NIST 800-88 Clear",
    },

    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "running",
        "completed",
        "failed",
      ],
      default: "running",
    },

    totalFiles: {
      type: Number,
      default: 0,
    },

    wipedFiles: {
      type: Number,
      default: 0,
    },

    verificationHash: {
      type: String,
      default: "",
    },

    verificationStatus: {
      type: String,
      enum: [
        "Pending",
        "VERIFIED",
        "FAILED",
      ],
      default: "Pending",
    },

    certificateId: {
      type: String,
      default: "",
    },

    events: [
      {
        message: {
          type: String,
          required: true,
        },

        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    failureReason: {
      type: String,
      default: "",
    },

    startedAt: {
      type: Date,
      default: Date.now,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    duration: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "WipeJob",
  wipeJobSchema
);