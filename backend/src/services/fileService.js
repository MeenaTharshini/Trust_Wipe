import fs from "fs";
import path from "path";

export const getFilesFromFolder = (folderPath) => {
  const files = [];

  const scan = (dir) => {
    const entries = fs.readdirSync(dir);

    for (const entry of entries) {
      const fullPath = path.join(dir, entry);

      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        scan(fullPath);
      } else {
        files.push({
          fileName: entry,
          path: fullPath,
          size: stat.size,
        });
      }
    }
  };

  scan(folderPath);

  return files;
};