import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  transports: ["websocket"],
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  timeout: 10000,
});

// ✅ connection debug (important)
socket.on("connect", () => {
  console.log("🟢 SOCKET CONNECTED:", socket.id);
});

socket.on("disconnect", () => {
  console.log("🔴 SOCKET DISCONNECTED");
});

socket.on("connect_error", (err) => {
  console.log("⚠️ SOCKET ERROR:", err.message);
});

export default socket;