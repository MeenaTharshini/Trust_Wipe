import fs from "fs";

export const readFileData = (path) => {
  const data = fs.readFileSync(path, "utf-8");

  return JSON.parse(data);
};

export const writeFileData = (
  path,
  data
) => {
  fs.writeFileSync(
    path,
    JSON.stringify(data, null, 2)
  );
};