import { useState } from "react";
import axios from "axios";

function WipeJobs() {
  const [deviceId, setDeviceId] = useState("");
  const [job, setJob] = useState(null);

  const startWipe = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/wipe/start",
        {
          deviceId,
        }
      );

      setJob(res.data);
    } catch (err) {
      console.log(err);
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

      <button onClick={startWipe}>
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