import fs from "fs";

export const readJSON = (filePath) => {
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
};

export const writeJSON = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};