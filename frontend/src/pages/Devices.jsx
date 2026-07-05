import { useEffect, useState } from "react";
import axios from "axios";
import "./Devices.css";
import {
  FiMonitor,
  FiHardDrive,
  FiCpu,
  FiRefreshCw,
  FiWifi,
} from "react-icons/fi";

function Devices() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [discovering, setDiscovering] = useState(false);

  const [form, setForm] = useState({
    deviceName: "",
    manufacturer: "",
    modelNumber: "",
    serialNumber: "",
    deviceType: "",
    storageType: "",
    capacity: "",
    location: "",
    storagePath: "",
  });

  const [search, setSearch] = useState("");

  // =========================
  // LOAD DEVICES
  // =========================
  const loadDevices = async () => {
  try {
    setLoading(true);

    const token = localStorage.getItem("token");

    const res = await axios.get("http://localhost:5000/api/devices", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setDevices(res.data || []);
  } catch (err) {
    console.log("LOAD ERROR:", err.response?.data || err.message);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    loadDevices();
  }, []);

  // =========================
  // MANUAL REGISTER
  // =========================
  const registerDevice = async () => {
  try {
    const token = localStorage.getItem("token");

    await axios.post(
      "http://localhost:5000/api/devices",
      form,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setForm({
      deviceName: "",
      manufacturer: "",
      modelNumber: "",
      serialNumber: "",
      deviceType: "",
      storageType: "",
      capacity: "",
      location: "",
      storagePath: "",
    });

    loadDevices();

    alert("Device registered successfully");
  } catch (err) {
    console.log("STATUS:", err.response?.status);
console.log("DATA:", err.response?.data);
console.log("ERROR:", err);
  }
};

  // =========================
  // DELETE DEVICE
  // =========================
  
  const deleteDevice = async (id) => {
  try {
    const token = localStorage.getItem("token");

    const confirmed = window.confirm(
      "Are you sure you want to delete this device?"
    );

    if (!confirmed) return;

    await axios.delete(
      `http://localhost:5000/api/devices/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setDevices((prev) =>
      prev.filter((device) => device._id !== id)
    );

    alert("Device deleted successfully");
  } catch (err) {
    console.log(
      "DELETE ERROR:",
      err.response?.data || err.message
    );

    alert("Failed to delete device");
  }
};
  // =========================
  // 🔥 REAL DRIVE DISCOVERY
  // =========================
  const runDriveDiscovery = async () => {
  try {
    setDiscovering(true);

    const token = localStorage.getItem("token");
    console.log("TOKEN =", token);
    const res = await axios.get(
      "http://localhost:5000/api/devices/discover",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("DISCOVERY RESULT:", res.data);

    if (
      res.data.success &&
      res.data.devices &&
      res.data.devices.length > 0
    ) {
      const drive = res.data.devices[0];

      setForm((prev) => ({
        ...prev,
        deviceName: drive.deviceName || "",
        serialNumber: drive.serialNumber || "",
        storageType: drive.storageType || "",
        capacity: drive.capacity || "",
        location: "",
      }));

      alert(
        "Drive discovered. Please complete the remaining details and click Register Device."
      );
    } else {
      alert("No drives found");
    }

  } catch (err) {
    console.log(
      "DISCOVERY ERROR:",
      err.response?.data || err.message
    );
  } finally {
    setDiscovering(false);
  }
};
  // =========================
  // FILTER
  // =========================
  const filtered = devices.filter((d) => {
    const q = search.toLowerCase();
    return (
      d.deviceName?.toLowerCase().includes(q) ||
      d.serialNumber?.toLowerCase().includes(q)
    );
  });

  // =========================
  // ICONS
  // =========================
  const getDeviceIcon = (type) => {
    switch ((type || "").toLowerCase()) {
      case "desktop":
      case "laptop":
        return <FiMonitor />;
      case "server":
        return <FiCpu />;
      case "external hdd":
      case "usb drive":
      case "hdd":
      case "ssd":
        return <FiHardDrive />;
      default:
        return <FiMonitor />;
    }
  };

  return (
    <div className="devices">

      {/* HERO */}
      <section className="devices-hero">
        <div className="hero-content">
          <p className="hero-label">ASSET MANAGEMENT</p>
          <h1>Device Command Center</h1>
          <p>Real-time inventory + secure wipe readiness system</p>
        </div>

        <div className="hero-card">
          <FiHardDrive size={50} />
          <h2>{devices.length}</h2>
          <span>Total Devices</span>
        </div>
      </section>

      {/* ACTION BAR */}
      <section className="kpi">
        <div>Total <h3>{devices.length}</h3></div>

        <div className="warn">
          Pending
          <h3>{devices.filter(d => d.status === "Pending").length}</h3>
        </div>

        <div className="ok">
          Completed
          <h3>{devices.filter(d => d.status === "Completed").length}</h3>
        </div>

        <div className="info">
          System <h3>LIVE</h3>
        </div>
      </section>

      {/* 🔥 DRIVE DISCOVERY PANEL */}
      <section className="panel">
        <h2>System Drive Discovery</h2>

        <button className="btn" onClick={runDriveDiscovery}>
          <FiWifi />
          {discovering ? "Scanning system..." : "Run Drive Discovery"}
        </button>

        <button className="btn" onClick={loadDevices}>
          <FiRefreshCw /> Refresh
        </button>
      </section>

      {/* MANUAL REGISTER */}
      <section className="panel">
        <h2>Manual Device Registration</h2>

        <div className="form">

          <input placeholder="Device Name"
            value={form.deviceName}
            onChange={(e) => setForm({ ...form, deviceName: e.target.value })}
          />

          <input placeholder="Manufacturer"
            value={form.manufacturer}
            onChange={(e) => setForm({ ...form, manufacturer: e.target.value })}
          />

          <input placeholder="Model Number"
            value={form.modelNumber}
            onChange={(e) => setForm({ ...form, modelNumber: e.target.value })}
          />

          <input placeholder="Serial Number"
            value={form.serialNumber}
            onChange={(e) => setForm({ ...form, serialNumber: e.target.value })}
          />

          <select
            value={form.deviceType}
            onChange={(e) => setForm({ ...form, deviceType: e.target.value })}
          >
            <option value="">Device Type</option>
            <option>Laptop</option>
            <option>Desktop</option>
            <option>Server</option>
          </select>

          <select
            value={form.storageType}
            onChange={(e) => setForm({ ...form, storageType: e.target.value })}
          >
            <option value="">Storage Type</option>
            <option>HDD</option>
            <option>SSD</option>
            <option>NVMe</option>
            <option>USB</option>
          </select>

          <input placeholder="Capacity (GB)"
            value={form.capacity}
            onChange={(e) => setForm({ ...form, capacity: e.target.value })}
          />


          <input placeholder="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />

          <input placeholder="Storage Path"
            value={form.storagePath}
            onChange={(e) => setForm({ ...form, storagePath: e.target.value })}
          />

        </div>

        <button className="btn" onClick={registerDevice}>
          Register Device
        </button>
      </section>

      {/* SEARCH */}
      <section className="searchBox">
        <input
          placeholder="Search devices..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </section>

      {/* DEVICE GRID */}
      <section className="grid">

        {filtered.map((d) => (
          <div className="device-card" key={d._id}>

            <div className="device-header">

              <div className="device-avatar">
                {getDeviceIcon(d.deviceType)}
              </div>

              <div className="device-title">
                <h3>{d.deviceName}</h3>
                <p>{d.serialNumber}</p>
              </div>

              <span className={`status-pill ${d.status?.toLowerCase()}`}>
                {d.status}
              </span>

            </div>

            <div className="device-specs">
              <div className="mini-stat">
                <span>Storage</span>
                <h4>{d.storageType}</h4>
              </div>

              <div className="mini-stat">
                <span>Capacity</span>
                <h4>{d.capacity} </h4>
              </div>

              <div className="mini-stat">
                <span>Location</span>
                <h4>{d.location}</h4>
              </div>

              <div className="mini-stat">
                <span>Status</span>
                <h4>{d.status}</h4>
              </div>
            </div>

            <div className="device-actions">
              <button className="details-btn">Details</button>
              <button className="delete-btn" onClick={() => deleteDevice(d._id)}>
                Delete
              </button>
            </div>

          </div>
        ))}

      </section>

    </div>
  );
}

export default Devices;