import axios from "axios";

const API = "https://trust-wipe.onrender.com/api/reports";

/* ======================================================
   COMMON DOWNLOAD FUNCTION
====================================================== */

const downloadFile = async (url, filename) => {
  try {

    const token = localStorage.getItem("token");

    const response = await axios.get(url, {
      responseType: "blob",

      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const blob = new Blob([response.data]);

    const downloadUrl =
      window.URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = downloadUrl;

    link.download = filename;

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(downloadUrl);

  } catch (err) {

    console.error(err);

    alert("Unable to download report.");

  }
};

/* ======================================================
   PDF
====================================================== */

export const downloadPDF = () => {

  downloadFile(
    `${API}/pdf`,
    "TrustWipe_Report.pdf"
  );

};

/* ======================================================
   EXCEL
====================================================== */

export const downloadExcel = () => {

  downloadFile(
    `${API}/excel`,
    "TrustWipe_Report.xlsx"
  );

};

/* ======================================================
   COMPLIANCE
====================================================== */

export const downloadCompliance = () => {

  downloadFile(
    `${API}/compliance`,
    "Compliance_Report.pdf"
  );

};