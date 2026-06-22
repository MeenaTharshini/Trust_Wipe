import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";

import {
FiShield,
FiHardDrive,
FiCheckCircle,
FiActivity,
FiSearch,
FiBell,
FiCpu,
} from "react-icons/fi";

import "./Dashboard.css";

const socket = io("http://localhost:5000");

function Dashboard() {
const navigate = useNavigate();

const [devices, setDevices] = useState([]);
const [jobs, setJobs] = useState([]);
const [notifications, setNotifications] = useState([]);
const [search, setSearch] = useState("");
const [loading, setLoading] = useState(true);
const [connected, setConnected] = useState(false);

const addNotification = (
message,
type = "info",
action = null
) => {
setNotifications((prev) => [
{
id: Date.now(),
message,
type,
action,
},
...prev,
]);
};

const fetchDevices = async () => {
try {
const res = await axios.get(
"http://localhost:5000/api/devices"
);

  setDevices(res.data || []);
} catch (err) {
  console.error(err);
}
};

const fetchJobs = async () => {
try {
const res = await axios.get(
"http://localhost:5000/api/wipe"
);

  setJobs(res.data.jobs || []);
} catch (err) {
  console.error(err);
}

};

const loadData = async () => {
try {
setLoading(true);

  await Promise.all([
    fetchDevices(),
    fetchJobs(),
  ]);
} finally {
  setLoading(false);
}

};

useEffect(() => {
loadData();
const interval = setInterval(() => {
  loadData();
}, 10000);

return () => clearInterval(interval);

}, []);

useEffect(() => {
socket.on("connect", () => {
setConnected(true);
});

socket.on("disconnect", () => {
  setConnected(false);
});

socket.on("wipe-progress", (job) => {
  setJobs((prev) => {
    const exists = prev.find(
      (j) => j._id === job._id
    );

    if (!exists) {
      return [job, ...prev];
    }

    return prev.map((j) =>
      j._id === job._id ? job : j
    );
  });

  if (job.status === "completed") {
    addNotification(
      `Verification Ready for Job ${job._id}`,
      "success",
      {
        label: "Verify",
        route: `/verification?jobId=${job._id}`,
      }
    );

    fetchDevices();
  }
});

return () => {
  socket.off("connect");
  socket.off("disconnect");
  socket.off("wipe-progress");
};

}, []);

const startWipe = async (
deviceId,
deviceName
) => {
try {
const res = await axios.post(
"http://localhost:5000/api/wipe/start",
{
deviceId,
}
);

  setJobs((prev) => [
    res.data,
    ...prev,
  ]);

  addNotification(
    `Wipe started for ${deviceName}`,
    "running"
  );

  fetchDevices();

} catch (err) {
  console.error(err);

  alert(
    err.response?.data?.message ||
    "Failed to start wipe"
  );
}
};

const filteredDevices = devices.filter(
(device) =>
device.deviceName
?.toLowerCase()
.includes(search.toLowerCase()) ||
device.serialNumber
?.toLowerCase()
.includes(search.toLowerCase())
);

const totalDevices = devices.length;

const completedDevices =
devices.filter(
(d) => d.status === "Completed"
).length;

const activeJobs =
jobs.filter(
(j) => j.status === "running"
);

return ( <div className="dashboard">

  <section className="hero-section">

    <div className="hero-content">

      <p className="hero-label">
        SECURITY OPERATIONS CENTER
      </p>

      <h1>
        TrustWipe Enterprise Console
      </h1>

      <p>
        Secure Data Sanitization,
        Verification &
        Compliance Platform
      </p>

    </div>

    <div className="trust-card">

      <FiShield size={50} />

      <h2>
        {connected
          ? "ONLINE"
          : "OFFLINE"}
      </h2>

      <span>
        Socket Status
      </span>

    </div>

  </section>

  <section className="stats-grid">

    <div className="stat-card">
      <FiHardDrive />
      <div>
        <span>Total Assets</span>
        <h2>{totalDevices}</h2>
      </div>
    </div>

    <div className="stat-card active">
      <FiActivity />
      <div>
        <span>Active Wipes</span>
        <h2>
          {activeJobs.length}
        </h2>
      </div>
    </div>

    <div className="stat-card success">
      <FiCheckCircle />
      <div>
        <span>Completed</span>
        <h2>
          {completedDevices}
        </h2>
      </div>
    </div>

    <div className="stat-card compliance">
      <FiShield />
      <div>
        <span>Compliance</span>
        <h2>100%</h2>
      </div>
    </div>

  </section>

  <div className="dashboard-grid">

    <section className="panel inventory-panel">

      <div className="panel-header">

        <h2>
          Device Inventory
        </h2>

        <div className="search-box">

          <FiSearch />

          <input
            value={search}
            placeholder="Search..."
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

        </div>

      </div>

      {loading ? (
        <div className="empty">
          Loading Devices...
        </div>
      ) : (
        <div className="table-wrapper">
        <table>

          <thead>
            <tr>
              <th>Device</th>
              <th>Serial</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {filteredDevices.map(
              (device) => (

                <tr
                  key={device._id}
                >

                  <td>
                    <FiCpu />{" "}
                    {device.deviceName}
                  </td>

                  <td>
                    {
                      device.serialNumber
                    }
                  </td>

                  <td>
  <span
    className={`badge ${
      device.status === "Pending"
        ? "pending"
        : device.status === "Completed"
        ? "completed"
        : "wiping"
    }`}
  >
    {device.status}
  </span>
</td>

                  <td>

                    {device.status ===
                      "Pending" && (

                      <button
                        className="wipe-btn"
                        onClick={() =>
                          startWipe(
                            device._id,
                            device.deviceName
                          )
                        }
                      >
                        Start Wipe
                      </button>

                    )}

                    {device.status ===
                      "Completed" && (

                      <button
                        className="verify-btn"
                        onClick={() =>
                          navigate(
                            `/verification?jobId=${device.currentJobId}`
                          )
                        }
                      >
                        Verify
                      </button>

                    )}

                  </td>

                </tr>

              )
            )}

          </tbody>

        </table>
</div>
      )}

    </section>

    <section className="side-column">

      <div className="panel">

        <h2>
          Live Operations
        </h2>

        {activeJobs.length ===
        0 ? (

          <div className="empty">
            No Active Jobs
          </div>

        ) : (

          activeJobs.map(
            (job) => (

              <div
                className="job-card"
                key={job._id}
              >

                <div className="job-top">

                  <span>
                    Job #{job._id}
                  </span>

                  <span>
                    {job.progress}%
                  </span>

                </div>

                <div className="progress-track">

                  <div
                    className="progress-fill"
                    style={{
                      width:
                        `${job.progress}%`,
                    }}
                  />

                </div>

              </div>

            )
          )

        )}

      </div>

    </section>

  </div>

</div>

);
}

export default Dashboard;
