import { useEffect, useState } from "react";
import axios from "axios";
import "./Devices.css";
import {
  FiMonitor,
  FiHardDrive,
  FiCpu,
  FiMapPin,
  FiUser,
  FiHash,
} from "react-icons/fi";
function Devices() {
  const [devices, setDevices] = useState([]);

  const [form, setForm] = useState({
    deviceName: "",
    manufacturer: "",
    modelNumber: "",
    serialNumber: "",
    deviceType: "",
    storageType: "",
    capacity: "",
    owner: "",
    location: "",
    storagePath: "",
  });

  const [search, setSearch] = useState("");

  const loadDevices = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/devices"
      );

      setDevices(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadDevices();
  }, []);

  const registerDevice = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/devices",
        form,
        {
          headers: {
            "Content-Type":
              "application/json",
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
        owner: "",
        location: "",
        storagePath: "",
      });

      loadDevices();
    } catch (err) {
      console.log(
        "ADD ERROR:",
        err.response?.data ||
          err.message
      );
    }
  };

  const deleteDevice = async (
    id
  ) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/devices/${id}`
      );

      loadDevices();
    } catch (err) {
      console.log(
        "DELETE ERROR:",
        err.response?.data ||
          err.message
      );
    }
  };

  const filtered =
    devices.filter((d) => {
      const q =
        search.toLowerCase();

      return (
        d.deviceName
          ?.toLowerCase()
          .includes(q) ||
        d.serialNumber
          ?.toLowerCase()
          .includes(q)
      );
    });
    const getDeviceIcon = (type) => {
  switch (type?.toLowerCase()) {
    case "desktop":
      return <FiMonitor />;
    case "laptop":
      return <FiMonitor />;
    case "server":
      return <FiCpu />;
    case "external hdd":
      return <FiHardDrive />;
    case "usb drive":
      return <FiHardDrive />;
    default:
      return <FiMonitor />;
  }
};

  return (
    <div className="devices">

      <section className="devices-hero">

  <div className="hero-content">

    <p className="hero-label">
      ASSET MANAGEMENT
    </p>

    <h1>
      Device Command Center
    </h1>

    <p>
      Enterprise device lifecycle management,
      inventory tracking and secure destruction
      operations.
    </p>

  </div>

  <div className="hero-card">

    <FiHardDrive size={50} />

    <h2>{devices.length}</h2>

    <span>Total Devices</span>

  </div>

</section>

      <section className="kpi">

        <div>
          Total
          <h3>
            {devices.length}
          </h3>
        </div>

        <div className="warn">
          Pending
          <h3>
            {
              devices.filter(
                (d) =>
                  d.status ===
                  "Pending"
              ).length
            }
          </h3>
        </div>

        <div className="ok">
          Completed
          <h3>
            {
              devices.filter(
                (d) =>
                  d.status ===
                  "Completed"
              ).length
            }
          </h3>
        </div>

        <div className="info">
          Compliance
          <h3>100%</h3>
        </div>

      </section>

      <section className="panel">

        <h2>
          Register Device
        </h2>

        <div className="form">

          <input
            placeholder="Device Name"
            value={form.deviceName}
            onChange={(e) =>
              setForm({
                ...form,
                deviceName:
                  e.target.value,
              })
            }
          />

          <input
            placeholder="Manufacturer"
            value={form.manufacturer}
            onChange={(e) =>
              setForm({
                ...form,
                manufacturer:
                  e.target.value,
              })
            }
          />

          <input
            placeholder="Model Number"
            value={form.modelNumber}
            onChange={(e) =>
              setForm({
                ...form,
                modelNumber:
                  e.target.value,
              })
            }
          />

          <input
            placeholder="Serial Number"
            value={form.serialNumber}
            onChange={(e) =>
              setForm({
                ...form,
                serialNumber:
                  e.target.value,
              })
            }
          />

          <select
            value={form.deviceType}
            onChange={(e) =>
              setForm({
                ...form,
                deviceType:
                  e.target.value,
              })
            }
          >
            <option value="">
              Device Type
            </option>

            <option>
              Laptop
            </option>

            <option>
              Desktop
            </option>

            <option>
              Server
            </option>

            <option>
              External HDD
            </option>

            <option>
              USB Drive
            </option>
          </select>

          <select
            value={form.storageType}
            onChange={(e) =>
              setForm({
                ...form,
                storageType:
                  e.target.value,
              })
            }
          >
            <option value="">
              Storage Type
            </option>

            <option>
              HDD
            </option>

            <option>
              SSD
            </option>

            <option>
              NVMe
            </option>

            <option>
              USB
            </option>
          </select>

          <input
            placeholder="Capacity (GB)"
            value={form.capacity}
            onChange={(e) =>
              setForm({
                ...form,
                capacity:
                  e.target.value,
              })
            }
          />

          <input
            placeholder="Asset Owner"
            value={form.owner}
            onChange={(e) =>
              setForm({
                ...form,
                owner:
                  e.target.value,
              })
            }
          />

          <input
            placeholder="Location"
            value={form.location}
            onChange={(e) =>
              setForm({
                ...form,
                location:
                  e.target.value,
              })
            }
          />

          <input
            placeholder="Storage Path (D:/DemoDrive)"
            value={form.storagePath}
            onChange={(e) =>
              setForm({
                ...form,
                storagePath:
                  e.target.value,
              })
            }
          />

        </div>

        <button
          className="btn"
          onClick={
            registerDevice
          }
        >
          Register Device
        </button>

      </section>

      <section className="searchBox">
        <input
          placeholder="Search by name or serial..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
        />
      </section>

      <section className="grid">

        {filtered.map((d) => (

          <div
            className="device-card"
            key={d._id}
          >

            <div className="device-header">

              <div className="device-avatar">
  {getDeviceIcon(d.deviceType)}
</div>

              <div className="device-title">

                <h3>
                  {d.deviceName}
                </h3>

                <p>
                  {
                    d.serialNumber
                  }
                </p>

              </div>

              <span
                className={`status-pill ${d.status?.toLowerCase()}`}
              >
                {d.status}
              </span>

            </div>

            <div className="device-specs">

  <div className="mini-stat">
    <span>Storage</span>
    <h4>{d.storageType || "--"}</h4>
  </div>

  <div className="mini-stat">
    <span>Capacity</span>
    <h4>{d.capacity || "--"} GB</h4>
  </div>

  <div className="mini-stat">
    <span>Location</span>
    <h4>{d.location || "--"}</h4>
  </div>

  <div className="mini-stat">
    <span>Status</span>
    <h4>{d.status || "Completed"}</h4>
  </div>

</div>


            <div className="device-actions">

              <button className="details-btn">
                Details
              </button>

              <button
                className="delete-btn"
                onClick={() =>
                  deleteDevice(
                    d._id
                  )
                }
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
