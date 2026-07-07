// agent/core/systemEngine.js
import { exec } from "child_process";
import os from "os";

/* =====================================================
   Execute PowerShell Script (Windows)
===================================================== */


import { spawn } from "child_process";

const execPowerShell = (script) => {
  return new Promise((resolve) => {
    const ps = spawn("powershell.exe", [
      "-NoProfile",
      "-ExecutionPolicy",
      "Bypass",
      "-Command",
      "-"
    ]);

    let stdout = "";
    let stderr = "";

    ps.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    ps.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    ps.on("close", () => {
      if (stderr.trim()) {
        console.log("PowerShell Error:");
        console.log(stderr);
      }

      try {
        const json = JSON.parse(stdout.trim() || "[]");
        resolve(Array.isArray(json) ? json : [json]);
      } catch (e) {
        console.log("JSON Parse Error:");
        console.log(stdout);
        resolve([]);
      }
    });

    ps.stdin.write(script);
    ps.stdin.end();
  });
};

/* =====================================================
   WINDOWS DRIVE DISCOVERY
===================================================== */
const windowsDrives = async () => {
  const script = `
$drives = Get-CimInstance Win32_DiskDrive

$result = foreach ($d in $drives) {

    $size = [math]::Round($d.Size / 1GB,2)

    if ($d.Model -match "NVMe") {
        $storageType = "NVMe"
    }
    elseif ($d.Model -match "SSD") {
        $storageType = "SSD"
    }
    else {
        $storageType = "HDD"
    }

    if ($size -lt 120) {
        $role = "SYSTEM"
        $wipeAllowed = $false
    }
    else {
        $role = "DATA"
        $wipeAllowed = $true
    }

    [PSCustomObject]@{
        deviceName    = $d.Model
        serialNumber  = $d.SerialNumber
        storageType   = $storageType
        capacity      = "$size GB"
        interface     = $d.InterfaceType
        index         = $d.Index
        status        = $d.Status
        manufacturer  = $d.Manufacturer
        modelNumber   = $d.Model
        role          = $role
        wipeAllowed   = $wipeAllowed
    }
}

$result | ConvertTo-Json -Depth 5
`;

  return await execPowerShell(script);
};

/* =====================================================
   LINUX DRIVE DISCOVERY
===================================================== */
const linuxDrives = () => {
  return new Promise((resolve) => {
    exec("lsblk -J -o NAME,SIZE,MODEL,SERIAL,TYPE", (err, stdout) => {
      if (err) {
        console.error("lsblk Error:", err.message);
        return resolve([]);
      }

      try {
        const json = JSON.parse(stdout);
        const drives = (json.blockdevices || [])
          .filter((d) => d.type === "disk")
          .map((d) => ({
            deviceName: d.model || d.name,
            serialNumber: d.serial || "Unknown",
            storageType: "Disk",
            capacity: d.size,
            role: "DATA",
            wipeAllowed: true,
          }));
        resolve(drives);
      } catch (e) {
        console.error("JSON Parse Error:", e.message);
        console.log("Raw Output:", stdout);
        resolve([]);
      }
    });
  });
};

/* =====================================================
   MAIN ENTRY POINT
===================================================== */
export const runDriveDiscovery = async () => {
  try {
    switch (os.platform()) {
      case "win32":
        return await windowsDrives();
      case "linux":
        return await linuxDrives();
      default:
        console.warn("Unsupported platform:", os.platform());
        return [];
    }
  } catch (err) {
    console.error("Drive Discovery Error:", err.message);
    return [];
  }
};
