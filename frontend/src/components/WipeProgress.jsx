import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./WipeProgress.css";

const socket = io("http://localhost:5000", {
  transports: ["websocket"],
  reconnection: true,
});

function WipeProgress({ jobId }) {

  const [progressData, setProgressData] =
    useState(null);

  const [connected, setConnected] =
    useState(false);

  const [logs, setLogs] = useState([]);

  useEffect(() => {

    socket.on("connect", () => {
      setConnected(true);
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };

  }, []);

  useEffect(() => {

    if (!jobId) return;

    const handler = (data) => {

      if (data.jobId === jobId) {

        setProgressData(data);

        setLogs((prev) => [
          `Progress updated to ${data.progress}%`,
          ...prev.slice(0, 4),
        ]);
      }

    };

    socket.on("wipe-progress", handler);

    return () => {
      socket.off("wipe-progress", handler);
    };

  }, [jobId]);

  if (!progressData) {

    return (
      <div className="wipe-progress-card">
        <h2>Waiting for wipe job...</h2>
      </div>
    );
  }

  const progress = progressData.progress || 0;

  const circleStyle = {
    background: `
      conic-gradient(
        #00e5ff ${progress * 3.6}deg,
        #1e293b 0deg
      )
    `,
  };

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
        className={`status-pill ${progressData.status}`}
      >
        {progressData.status}
      </div>

      <div className="info-grid">

        <div className="info-card">
          <p>Device</p>
          <h4>{progressData.deviceId}</h4>
        </div>

        <div className="info-card">
          <p>Job ID</p>
          <h4>{progressData.jobId}</h4>
        </div>

        <div className="info-card">
          <p>Phase</p>
          <h4>
            {progress < 30
              ? "Initialization"
              : progress < 70
              ? "Secure Wiping"
              : "Verification"}
          </h4>
        </div>

        <div className="info-card">
          <p>ETA</p>
          <h4>
            {Math.max(
              0,
              Math.ceil((100 - progress) / 5)
            )} min
          </h4>
        </div>

      </div>

      <div className="logs">

        <h3>Activity Logs</h3>

        {logs.map((log, i) => (
          <div
            key={i}
            className="log-item"
          >
            {log}
          </div>
        ))}

      </div>

    </div>
  );
}

export default WipeProgress;