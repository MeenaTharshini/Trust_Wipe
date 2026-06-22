import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema(
  {
    deviceName: String,
    serialNumber: String,
    storageType: String,
    capacity: String,

    status: {
      type: String,
      default: "Pending",
    },

    location: String,

    // 🔥 ADD THIS (VERY IMPORTANT FIX)
    currentJobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WipeJob",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Device", deviceSchema);