import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema(
  {
    deviceName: {
      type: String,
      required: true,
    },

    serialNumber: {
      type: String,
      required: true,
      unique: true,
    },

    storageType: {
      type: String,
      default: "Unknown",
    },

    capacity: {
      type: String,
      default: "N/A",
    },

    location: {
      type: String,
      default: "N/A",
    },

    storagePath: {
      type: String,
      required: false,
    },

    status: {
      type: String,
      enum: ["Pending", "Wiping", "Completed", "Failed"],
      default: "Pending",
    },

    currentJobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WipeJob",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Device", deviceSchema);