import os from "os";
import { exec } from "child_process";

export const discoverDrives = async () => {
  const platform = os.platform();

  return new Promise((resolve, reject) => {
    if (platform === "win32") {
      exec(
        `powershell "Get-PhysicalDisk | Select FriendlyName,SerialNumber,MediaType,Size | ConvertTo-Json"`,
        (err, stdout) => {
          if (err) return reject(err);

          try {
            const disks = JSON.parse(stdout);

            const list = Array.isArray(disks)
              ? disks
              : [disks];

            resolve(
              list.map((disk) => ({
                deviceName:
                  disk.FriendlyName,

                serialNumber:
                  disk.SerialNumber,

                storageType:
                  disk.MediaType,

                capacity: (
                  disk.Size /
                  1024 /
                  1024 /
                  1024
                ).toFixed(2) + " GB",
              }))
            );
          } catch (e) {
            reject(e);
          }
        }
      );
    }

    else {
      resolve([]);
    }
  });
};