export const checkPath = async (req, res) => {
  try {
    const {
      deviceId,
      path,
      verificationType = "auto",
    } = req.body;

    if (!deviceId) {
      return res.status(400).json({
        success: false,
        message: "deviceId is required",
      });
    }

    if (!path) {
      return res.status(400).json({
        success: false,
        message: "path is required",
      });
    }

    console.log("PATH VERIFICATION REQUEST:", {
      deviceId,
      path,
      verificationType,
    });

    /*
      IMPORTANT:

      This is where your backend should send the
      path-check request to the TrustWipe Agent.

      Do NOT use fs.existsSync(path) here because
      the backend is running on Render, not on the
      user's Windows computer.
    */

    return res.status(200).json({
      success: true,
      exists: false,
      deviceId,
      path,
      verificationType,
      checkedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("PATH VERIFICATION ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Path verification failed",
    });
  }
};