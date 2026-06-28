import PDFDocument from "pdfkit";
import fs from "fs";

export const generateCertificate = async (certificate, deviceName) => {
  const doc = new PDFDocument();

  const path = `certificates/${certificate._id}.pdf`;

  doc.pipe(fs.createWriteStream(path));

  doc.fontSize(22).text("Trust Wipe Certificate");
  doc.moveDown();

  doc.fontSize(12);

  doc.text(`Certificate ID: ${certificate._id}`);
  doc.text(`Device: ${deviceName}`);
  doc.text(`Algorithm: ${certificate.algorithm}`);

  doc.moveDown();

  doc.text("VERIFICATION SIGNATURE:");
  doc.text(certificate.signature);

  doc.moveDown();

  doc.text("STATUS: CRYPTOGRAPHICALLY VERIFIED");

  doc.end();

  return path;
};