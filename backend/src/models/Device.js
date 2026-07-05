import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema({

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    deviceName: {
        type: String,
        required: true,
    },

    serialNumber: {
        type: String,
        required: true,
    },

    manufacturer: {
        type: String,
        default: "",
    },

    modelNumber: {
        type: String,
        default: "",
    },

    deviceType: {
        type: String,
        default: "",
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
        default: "",
    },

    storagePath: {
        type: String,
        default: "",
    },

    files: [
        {
            fileName: String,
            fileSize: String,
            path: String,
            status: {
                type: String,
                default: "Pending",
            },
        },
    ],

    status: {
        type: String,
        enum: [
            "Pending",
            "Wiping",
            "Completed",
            "Failed",
        ],
        default: "Pending",
    },

    currentJobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "WipeJob",
        default: null,
    },

}, {
    timestamps: true,
});

export default mongoose.model("Device", deviceSchema);