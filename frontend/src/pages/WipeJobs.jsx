import { useState } from "react";
import axios from "axios";

function WipeJobs() {
  const [deviceId, setDeviceId] = useState("");
  const [job, setJob] = useState(null);

  const startWipe = async (deviceId) => {
  try {
    const token = localStorage.getItem("token");

    console.log("POST Token:", token);

    const res = await axios.post(
      "http://localhost:5000/api/wipe/start",
      { deviceId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setJobs((prev) => [res.data, ...prev]);
    fetchDevices();
  } catch (err) {
    console.log(err.response?.data || err.message);
  }
};
  return (
    <div>
      <h1>Wipe Jobs</h1>

      <input
        type="number"
        placeholder="Device ID"
        value={deviceId}
        onChange={(e) =>
          setDeviceId(e.target.value)
        }
      />

      <button onClick={() => startWipe(deviceId)}>
    Start Wipe
</button>

      {job && (
        <div>
          <h3>Job Created</h3>

          <p>ID: {job.id}</p>
          <p>Status: {job.status}</p>
        </div>
      )}
    </div>
  );
}

export default WipeJobs;