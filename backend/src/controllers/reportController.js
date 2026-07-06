import Device from "../models/Device.js";
import Certificate from "../models/Certificate.js";
import WipeJob from "../models/WipeJob.js";
import generateExcel from "../reportEngine/generateExcel.js";
import generateComplianceReport from "../reportEngine/generateComplianceReport.js";
import generatePDF from "../reportEngine/generatePDF.js";

export const downloadExcelReport = async (req, res) => {
  try {
    const devices = await Device.find().lean();
    const certificates = await Certificate.find().lean();
    const wipeJobs = await WipeJob.find().lean();

    const workbook = await generateExcel({
      devices,
      certificates,
      wipeJobs,
    });

    const buffer = await workbook.xlsx.writeBuffer();

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="TrustWipe_Report.xlsx"'
    );

    res.send(Buffer.from(buffer));

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to generate Excel report",
      error: err.message,
    });
  }
};
export const downloadComplianceReport = async (req, res) => {
  try {
    const devices = await Device.find().lean();
    const certificates = await Certificate.find().lean();

    const pdf = generateComplianceReport({
      devices,
      certificates,
    });

    const buffer = Buffer.from(
      pdf.output("arraybuffer")
    );

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="Compliance_Report.pdf"'
    );

    res.send(buffer);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to generate compliance report",
      error: err.message,
    });
  }
};
/* =======================================================
   DOWNLOAD PDF REPORT
======================================================= */

export const downloadPDFReport = async (req, res) => {
  try {

    /* -----------------------------
       Fetch Database Data
    ----------------------------- */

    const devices = await Device.find().lean();

    const certificates = await Certificate.find().lean();

    const wipeJobs = await WipeJob.find().lean();

    /* -----------------------------
       Logged-in User
    ----------------------------- */

    const generatedBy =
      req.user?.name ||
      req.user?.email ||
      "Administrator";

    /* -----------------------------
       Generate PDF
    ----------------------------- */

    const pdf = generatePDF({
      devices,
      certificates,
      wipeJobs,
      generatedBy,
    });

    /* -----------------------------
       Convert PDF to Buffer
    ----------------------------- */

    const pdfBuffer = Buffer.from(
      pdf.output("arraybuffer")
    );

    /* -----------------------------
       Send File
    ----------------------------- */

    const today = new Date();

    const fileName =
      `TrustWipe_Report_${
        today.getFullYear()
      }-${
        String(today.getMonth() + 1).padStart(2, "0")
      }-${
        String(today.getDate()).padStart(2, "0")
      }.pdf`;

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${fileName}"`
    );

    res.send(pdfBuffer);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Failed to generate PDF report",
      error: err.message,
    });

  }
};