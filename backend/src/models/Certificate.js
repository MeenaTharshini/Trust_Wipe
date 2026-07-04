import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    certificateId: {
      type: String,
      unique: true,
      required: true,
      trim: true,
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
    manufacturer: {
  type: String,
  default: "",
},

modelNumber: {
  type: String,
  default: "",
},

owner: {
  type: String,
  default: "",
},

location: {
  type: String,
  default: "",
},

deviceType: {
  type: String,
  default: "",
},

storagePath: {
  type: String,
  default: "",
},
    sanitizationStandard: {
      type: String,
      default: "NIST SP 800-88 Rev.1",
    },

    algorithm: {
      type: String,
      default: "NIST SP 800-88 Clear",
    },

    verificationMethod: {
      type: String,
      default:
        "SHA-256 + Content Validation",
    },

    verificationHash: {
      type: String,
      default: "",
    },

    signature: {
      type: String,
      default: "",
    },

    verificationStatus: {
      type: String,
      enum: [
        "VERIFIED",
        "FAILED",
        "PENDING",
      ],
      default: "VERIFIED",
    },

    wipedFiles: {
      type: Number,
      default: 0,
    },
    verifiedFiles: {
  type: Number,
  default: 0,
},

verificationFailures: {
  type: Number,
  default: 0,
},

verificationEvidenceHash: {
  type: String,
  default: "",
},
    wipeCompletedAt: {
      type: Date,
    },

    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    issuedAt: {
      type: Date,
      default: Date.now,
    },

    pdfUrl: {
      type: String,
      default: "",
    },

    remarks: {
      type: String,
      default: "",
    },

    active: {
      type: Boolean,
      default: true,
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