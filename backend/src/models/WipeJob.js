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
      enum: ["pending", "running", "completed", "failed"],
      default: "running",
    },

    events: [
      {
        message: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    verificationHash: String,
    verificationStatus: {
      type: String,
      default: "Pending",
    },

    failureReason: String,

    startedAt: Date,
    completedAt: Date,
    duration: Number,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("WipeJob", wipeJobSchema);