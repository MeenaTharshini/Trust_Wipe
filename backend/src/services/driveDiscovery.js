import fs from "fs";
import path from "path";

/*
=========================================
RECURSIVE FILE DISCOVERY
=========================================
Returns every file inside a folder
and all subfolders.
=========================================
*/

export const discoverFiles = (rootPath) => {
  const files = [];

  const scan = (currentPath) => {
    if (!fs.existsSync(currentPath)) {
      return;
    }

    const items = fs.readdirSync(currentPath);

    for (const item of items) {
      const fullPath = path.join(
        currentPath,
        item
      );

      const stats =
        fs.statSync(fullPath);

      if (stats.isDirectory()) {
        scan(fullPath);
      } else {
        files.push({
          name: item,
          path: fullPath,
          size: stats.size,
          extension:
            path.extname(item),
          createdAt:
            stats.birthtime,
          modifiedAt:
            stats.mtime,
        });
      }
    }
  };

  scan(rootPath);

  return files;
};

/*
=========================================
GET DIRECTORY STATISTICS
=========================================
*/

export const getDirectoryStats = (
  rootPath
) => {
  const discoveredFiles =
    discoverFiles(rootPath);

  const totalFiles =
    discoveredFiles.length;

  const totalBytes =
    discoveredFiles.reduce(
      (sum, file) =>
        sum + file.size,
      0
    );

  return {
    totalFiles,
    totalBytes,
    totalMB: (
      totalBytes /
      1024 /
      1024
    ).toFixed(2),
    files: discoveredFiles,
  };
};