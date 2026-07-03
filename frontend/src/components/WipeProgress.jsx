import { useEffect, useState } from "react";
import socket from "../services/socket";
import "./WipeProgress.css";

function WipeProgress({ jobId }) {
  const [job, setJob] = useState(null);
  const [connected, setConnected] = useState(false);
  const [logs, setLogs] = useState([]);

  // ---------------- SOCKET STATUS ----------------

  useEffect(() => {
    const onConnect = () => {
      console.log("SOCKET CONNECTED");
      setConnected(true);
    };

    const onDisconnect = () => {
      console.log("SOCKET DISCONNECTED");
      setConnected(false);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    setConnected(socket.connected);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  // ---------------- WIPE EVENTS ----------------

  useEffect(() => {
    if (!jobId) return;

    const handleProgress = (data) => {
      console.log("WIPE EVENT:", data);

      if (String(data._id) !== String(jobId)) {
        return;
      }

      setJob(data);

      if (data.events?.length) {
        const latest =
          data.events[data.events.length - 1];

        setLogs((prev) => {
          if (prev[0] === latest.message) {
            return prev;
          }

          return [
            latest.message,
            ...prev,
          ].slice(0, 10);
        });
      }
    };

    socket.on("wipe-progress", handleProgress);

    return () => {
      socket.off(
        "wipe-progress",
        handleProgress
      );
    };
  }, [jobId]);

  // ---------------- WAITING ----------------

  if (!job) {
    return (
      <div className="wipe-progress-card">
        <h2>Waiting for wipe job...</h2>
      </div>
    );
  }

  const progress = job.progress || 0;

  const circleStyle = {
    background: `conic-gradient(
      #00e5ff ${progress * 3.6}deg,
      #1e293b 0deg
    )`,
  };

  // ---------------- STATUS TEXT ----------------

  let phase = "Initializing";

  if (progress >= 20 && progress < 80) {
    phase = "Secure Wiping";
  }

  if (progress >= 80 && progress < 100) {
    phase = "Verification";
  }

  if (progress === 100) {
    phase = "Completed";
  }

  // ---------------- UI ----------------

  return (
    <div className="wipe-progress-card">

      <div className="wipe-header">

        <div className="wipe-title">
          Live Wipe Monitor
        </div>

        <div
          className={
            connected
              ? "connection online"
              : "connection offline"
          }
        >
          {connected
            ? "● Connected"
            : "● Offline"}
        </div>

      </div>

      <div className="circle-wrapper">

        <div
          className="progress-circle"
          style={circleStyle}
        >
          <div className="circle-inner">
            <h2>{progress}%</h2>
            <span>Completed</span>
          </div>
        </div>

      </div>

      <div
        className={`status-pill ${
          job.status || "running"
        }`}
      >
        {job.status}
      </div>

      <div className="info-grid">

        <div className="info-card">
          <p>Job ID</p>
          <h4>
            {String(job._id).slice(0, 8)}
          </h4>
        </div>

        <div className="info-card">
          <p>Phase</p>
          <h4>{phase}</h4>
        </div>

        <div className="info-card">
          <p>Verification</p>
          <h4>
            {job.verificationStatus ||
              "Pending"}
          </h4>
        </div>

        <div className="info-card">
          <p>Duration</p>
          <h4>
            {job.duration
              ? `${job.duration}s`
              : "--"}
          </h4>
        </div>

      </div>

      <div className="logs">

        <h3>Activity Logs</h3>

        {logs.length === 0 ? (
          <div className="log-item">
            Waiting for events...
          </div>
        ) : (
          logs.map((log, index) => (
            <div
              key={index}
              className="log-item"
            >
              {log}
            </div>
          ))
        )}

      </div>

    </div>
  );
}

export default WipeProgress;