import ExcelJS from "exceljs";

export default async function generateExcel(reportData) {

  const {
    devices = [],
    certificates = [],
    wipeJobs = [],
  } = reportData;

  const workbook = new ExcelJS.Workbook();

  workbook.creator = "TrustWipe Enterprise";
  workbook.company = "TrustWipe";
  workbook.subject = "Enterprise Data Sanitization Report";
  workbook.title = "TrustWipe Report";

  /* ===================================================
      SUMMARY SHEET
  =================================================== */

  const summary = workbook.addWorksheet("Summary");

  summary.columns = [
    { width: 35 },
    { width: 20 }
  ];

  summary.mergeCells("A1:B1");

  const title = summary.getCell("A1");

  title.value = "TrustWipe Enterprise Report";

  title.font = {
    size: 22,
    bold: true,
    color: { argb: "FFFFFF" }
  };

  title.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "0099FF" }
  };

  title.alignment = {
    horizontal: "center"
  };

  const completed =
    devices.filter(d => d.status === "Completed").length;

  const pending =
    devices.filter(d => d.status === "Pending").length;

  const wiping =
    devices.filter(d => d.status === "Wiping").length;

  const completionRate =
    devices.length
      ? Math.round(
          completed /
          devices.length *
          100
        )
      : 0;

  const summaryRows = [

    ["Generated", new Date().toLocaleString()],

    ["Total Devices", devices.length],

    ["Completed", completed],

    ["Pending", pending],

    ["Running", wiping],

    ["Certificates", certificates.length],

    ["Wipe Jobs", wipeJobs.length],

    ["Completion Rate", `${completionRate}%`]

  ];

  summaryRows.forEach(row => summary.addRow(row));

  summary.getColumn(1).font = {
    bold: true
  };

  /* ===================================================
      DEVICES
  =================================================== */

  const deviceSheet =
    workbook.addWorksheet("Devices");

  deviceSheet.columns = [

    {
      header: "Device",
      key: "deviceName",
      width: 30
    },

    {
      header: "Serial",
      key: "serialNumber",
      width: 28
    },

    {
      header: "Storage",
      key: "storageType",
      width: 20
    },

    {
      header: "Capacity",
      key: "capacity",
      width: 15
    },

    {
      header: "Status",
      key: "status",
      width: 18
    }

  ];

  devices.forEach(device => {

    deviceSheet.addRow({

      deviceName:
        device.deviceName,

      serialNumber:
        device.serialNumber,

      storageType:
        device.storageType,

      capacity:
        device.capacity,

      status:
        device.status

    });

  });

  deviceSheet.getRow(1).font = {
    bold: true,
    color: { argb: "FFFFFF" }
  };

  deviceSheet.getRow(1).fill = {

    type: "pattern",

    pattern: "solid",

    fgColor: {
      argb: "007ACC"
    }

  };

  /* ===================================================
      WIPE JOBS
  =================================================== */

  const jobSheet =
    workbook.addWorksheet("Wipe Jobs");

  jobSheet.columns = [

    {
      header: "Job ID",
      key: "_id",
      width: 30
    },

    {
      header: "Status",
      key: "status",
      width: 18
    },

    {
      header: "Progress",
      key: "progress",
      width: 18
    },

    {
      header: "Algorithm",
      key: "algorithm",
      width: 20
    }

  ];

  wipeJobs.forEach(job => {

    jobSheet.addRow({

      _id: job._id,

      status: job.status,

      progress: `${job.progress}%`,

      algorithm:
        job.algorithm ||
        "RSA-SHA256"

    });

  });

  jobSheet.getRow(1).font = {
    bold: true,
    color: { argb: "FFFFFF" }
  };

  jobSheet.getRow(1).fill = {

    type: "pattern",

    pattern: "solid",

    fgColor: {
      argb: "009966"
    }

  };

  /* ===================================================
      CERTIFICATES
  =================================================== */

  const certSheet =
    workbook.addWorksheet("Certificates");

  certSheet.columns = [

    {
      header: "Certificate",
      key: "certificateId",
      width: 35
    },

    {
      header: "Device",
      key: "deviceName",
      width: 30
    },

    {
      header: "Algorithm",
      key: "algorithm",
      width: 20
    },

    {
      header: "Status",
      key: "status",
      width: 18
    }

  ];

  certificates.forEach(cert => {

    certSheet.addRow({

      certificateId:
        cert.certificateId ||
        cert._id,

      deviceName:
        cert.deviceName ||
        cert.deviceId,

      algorithm:
        cert.algorithm ||
        "RSA-SHA256",

      status:
        cert.status ||
        "Verified"

    });

  });

  certSheet.getRow(1).font = {
    bold: true,
    color: { argb: "FFFFFF" }
  };

  certSheet.getRow(1).fill = {

    type: "pattern",

    pattern: "solid",

    fgColor: {
      argb: "4444FF"
    }

  };

  return workbook;
}