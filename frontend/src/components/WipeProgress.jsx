import { useEffect, useState } from "react";
import socket from "../services/socket";
import "./WipeProgress.css";

function WipeProgress({ jobId }) {
  const [job, setJob] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    setConnected(socket.connected);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  useEffect(() => {
    if (!jobId) return;

    const handleProgress = (data) => {
      if (String(data._id) !== String(jobId)) return;
      setJob(data);
    };

    socket.on("wipe-progress", handleProgress);

    return () => {
      socket.off("wipe-progress", handleProgress);
    };
  }, [jobId]);

  if (!job) {
    return (
      <div className="wipe-progress-card">
        <h2>Waiting for wipe job...</h2>
      </div>
    );
  }

  const progress = job.progress || 0;

  const formatDate = (date) => {
    if (!date) return "--";
    return new Date(date).toLocaleString();
  };

  const stages = [
    "Random Overwrite",
    "Zero Overwrite",
    "Verification",
    "SHA-256 Hash",
    "RSA Signature",
    "Certificate",
    "Completed",
  ];

  const activeStage =
    progress >= 100 ? 6 :
    progress >= 97 ? 5 :
    progress >= 94 ? 4 :
    progress >= 90 ? 3 :
    progress >= 80 ? 2 :
    progress >= 50 ? 1 : 0;

  return (
    <div className="wipe-progress-card">

      <div className="wipe-header">
        <div>
          <h2>Trust Wipe Monitor</h2>
          <p className="sub">
            Live Sanitization Tracking
          </p>
        </div>

        <div
          className={`connection ${
            connected ? "online" : "offline"
          }`}
        >
          {connected ? "● LIVE" : "● OFFLINE"}
        </div>
      </div>

      <div className="circle-wrapper">
        <div
          className="progress-circle"
          style={{
            background: `conic-gradient(
              #00e5ff ${progress * 3.6}deg,
              rgba(255,255,255,.08) 0deg
            )`,
          }}
        >
          <div className="circle-inner">
            <h1>{progress}%</h1>
            <span>Completed</span>
          </div>
        </div>
      </div>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

      <div className={`status-pill ${job.status}`}>
        {job.status}
      </div>

      <div className="info-grid">
        <div className="info-card">
          <span>Algorithm</span>
          <h4>{job.algorithm}</h4>
        </div>

        <div className="info-card">
          <span>Files Wiped</span>
          <h4>
            {job.wipedFiles}/{job.totalFiles}
          </h4>
        </div>

        <div className="info-card">
          <span>Verification</span>
          <h4>{job.verificationStatus}</h4>
        </div>

        <div className="info-card">
          <span>Duration</span>
          <h4>
            {job.duration
              ? `${job.duration}s`
              : "--"}
          </h4>
        </div>
      </div>

      <div className="section">
        <h3>Current Stage</h3>

        <div className="timeline">
          {stages.map((stage, index) => (
            <div
              key={index}
              className={`timeline-item ${
                index <= activeStage
                  ? "done"
                  : ""
              }`}
            >
              <div className="timeline-dot" />
              <span>{stage}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <h3>Verification Hash</h3>

        <div className="hash-box">
          {job.verificationHash
            ? job.verificationHash
            : "Pending"}
        </div>
      </div>

      <div className="section">
        <h3>Certificate</h3>

        <div className="certificate-box">
          <p>
            Certificate ID
          </p>

          <h4>
            {job.certificateId ||
              "Pending"}
          </h4>
        </div>
      </div>

      <div className="timestamps">
        <div>
          <span>Started</span>
          <p>
            {formatDate(
              job.startedAt
            )}
          </p>
        </div>

        <div>
          <span>Completed</span>
          <p>
            {formatDate(
              job.completedAt
            )}
          </p>
        </div>
      </div>

      <div className="logs">
        <h3>Audit Timeline</h3>

        {job.events?.length ? (
          [...job.events]
            .reverse()
            .map(
              (
                event,
                index
              ) => (
                <div
                  key={index}
                  className="log-item"
                >
                  <div>
                    {
                      event.message
                    }
                  </div>

                  <small>
                    {event.timestamp
                      ? new Date(
                          event.timestamp
                        ).toLocaleTimeString()
                      : ""}
                  </small>
                </div>
              )
            )
        ) : (
          <div className="log-item">
            No records found
          </div>
        )}
      </div>
    </div>
  );
}

export default WipeProgress;