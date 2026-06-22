import mongoose from "mongoose";

const wipeJobSchema = new mongoose.Schema(
  {
    deviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Device",
      required: true
    },

    progress: {
      type: Number,
      default: 0
    },

    status: {
      type: String,
      enum: ["running", "completed", "failed"],
      default: "running"
    },

    // 🔐 NEW: audit trail (tamper-proofing backbone)
    events: [
      {
        type: String
      }
    ],

    startedAt: {
      type: Date,
      default: Date.now
    },

    completedAt: Date
  },
  { timestamps: true }
);

export default mongoose.model("WipeJob", wipeJobSchema);