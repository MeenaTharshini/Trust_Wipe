import WipeJob from "../models/WipeJob.js";
import Certificate from "../models/Certificate.js";

export const verifyWipe = async (req, res) => {
  try {
    const { jobId } = req.body;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "Job ID is required",
      });
    }

    const wipeJob =
      await WipeJob.findById(jobId);

    if (!wipeJob) {
      return res.status(404).json({
        success: false,
        message: "Wipe job not found",
      });
    }

    const certificate =
      await Certificate.findOne({
        jobId: wipeJob._id,
      });

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found",
      });
    }

    res.status(200).json({
      success: true,

      certificateId:
        certificate.certificateId,

      jobId:
        certificate.jobId,

      algorithm:
        certificate.algorithm,

      signature:
        certificate.signature,

      status:
        certificate.verificationStatus,

      verifiedAt:
        certificate.createdAt,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};