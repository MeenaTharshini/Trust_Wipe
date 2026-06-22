import { useEffect, useState } from "react";
import axios from "axios";
import "./Devices.css";

function Devices() {
  const [devices, setDevices] = useState([]);

  const [form, setForm] = useState({
    deviceName: "",
    serialNumber: "",
    storageType: "",
    capacity: "",
    location: "",
  });

  const [search, setSearch] = useState("");

  // ---------------- LOAD DEVICES ----------------
  const loadDevices = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/devices");
      setDevices(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadDevices();
  }, []);

  // ---------------- REGISTER ----------------
  const registerDevice = async () => {
    try {
      await axios.post("http://localhost:5000/api/devices", form);

      setForm({
        deviceName: "",
        serialNumber: "",
        storageType: "",
        capacity: "",
        location: "",
      });

      loadDevices();
    } catch (err) {
      console.log(err);
    }
  };

  // ---------------- DELETE ----------------
  const deleteDevice = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/devices/${id}`);
      loadDevices();
    } catch (err) {
      console.log(err);
    }
  };

  // ---------------- FILTER ----------------
  const filtered = devices.filter((d) => {
    const q = search.toLowerCase();
    return (
      d.deviceName?.toLowerCase().includes(q) ||
      d.serialNumber?.toLowerCase().includes(q)
    );
  });

  // ---------------- UI ----------------
  return (
    <div className="devices">

      {/* HERO */}
      <section className="devices-hero">
        <div>
          <p className="label">ASSET MANAGEMENT</p>
          <h1>Device Command Center</h1>
          <p className="subtitle">
            Enterprise device lifecycle & secure destruction tracking
          </p>
        </div>

        <div className="hero-card">
          <span>Total Devices</span>
          <h2>{devices.length}</h2>
        </div>
      </section>

      {/* KPI */}
      <section className="kpi">
        <div>Total <h3>{devices.length}</h3></div>
        <div className="warn">
          Pending <h3>{devices.filter(d => d.status === "Pending").length}</h3>
        </div>
        <div className="ok">
          Completed <h3>{devices.filter(d => d.status === "Completed").length}</h3>
        </div>
        <div className="info">
          Compliance <h3>100%</h3>
        </div>
      </section>

      {/* REGISTER */}
      <section className="panel">
        <h2>Register Device</h2>

        <div className="form">
          <input
            placeholder="Device Name"
            value={form.deviceName}
            onChange={(e) =>
              setForm({ ...form, deviceName: e.target.value })
            }
          />

          <input
            placeholder="Serial Number"
            value={form.serialNumber}
            onChange={(e) =>
              setForm({ ...form, serialNumber: e.target.value })
            }
          />

          <select
            value={form.storageType}
            onChange={(e) =>
              setForm({ ...form, storageType: e.target.value })
            }
          >
            <option value="">Storage Type</option>
            <option>SSD</option>
            <option>HDD</option>
            <option>NVMe</option>
            <option>USB</option>
          </select>

          <input
            placeholder="Capacity"
            value={form.capacity}
            onChange={(e) =>
              setForm({ ...form, capacity: e.target.value })
            }
          />

          <input
            placeholder="Location"
            value={form.location}
            onChange={(e) =>
              setForm({ ...form, location: e.target.value })
            }
          />
        </div>

        <button className="btn" onClick={registerDevice}>
          Register Device
        </button>
      </section>

      {/* SEARCH */}
      <section className="searchBox">
        <input
          placeholder="Search by name or serial..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </section>

      <section className="grid">
  {filtered.map((d) => (
    <div className="device-card" key={d._id}>

      <div className="card-glow"></div>

      <div className="device-header">

        <div className="device-avatar">
          💻
        </div>

        <div className="device-title">
          <h3>{d.deviceName}</h3>
          <p>{d.serialNumber}</p>
        </div>

        <span
          className={`status-pill ${d.status?.toLowerCase()}`}
        >
          {d.status}
        </span>

      </div>

      <div className="device-specs">

        <div className="spec-box">
          <span>Storage</span>
          <strong>{d.storageType}</strong>
        </div>

        <div className="spec-box">
          <span>Capacity</span>
          <strong>{d.capacity}</strong>
        </div>

        <div className="spec-box">
          <span>Location</span>
          <strong>{d.location}</strong>
        </div>

        <div className="spec-box">
          <span>Compliance</span>
          <strong>NIST 800-88</strong>
        </div>

      </div>

      <div className="device-actions">

        <button className="details-btn">
          Details
        </button>

        <button
          className="delete-btn"
          onClick={() => deleteDevice(d._id)}
        >
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