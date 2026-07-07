// agent/core/socketClient.js

import { io } from "socket.io-client";
import os from "os";
import dotenv from "dotenv";

import { runDriveDiscovery } from "./systemEngine.js";
import {
  startWipeTask,
  cancelWipeTask,
} from "./taskEngine.js";


dotenv.config();


/* =====================================================
   SERVER CONFIG
===================================================== */

const SERVER_URL =
  process.env.SERVER_URL ||
  "https://trust-wipe.onrender.com";


/* =====================================================
   SOCKET CONNECTION
===================================================== */

const socket = io(SERVER_URL, {

  transports: [
    "websocket"
  ],

  reconnection: true,

  reconnectionAttempts: Infinity,

  timeout: 10000,

});


/* =====================================================
   AGENT IDENTITY
===================================================== */

const AGENT_ID =
  process.env.AGENT_ID ||
  os.hostname();



/* =====================================================
   STARTUP LOG
===================================================== */

console.log("=================================");
console.log(" TrustWipe Agent Starting");
console.log(" Agent ID:", AGENT_ID);
console.log(" Server:", SERVER_URL);
console.log("=================================");



/* =====================================================
   CONNECT
===================================================== */

socket.on("connect", () => {

  console.log(
    "🟢 Connected to TrustWipe Server"
  );


  socket.emit(
    "register-agent",
    {

      deviceId: AGENT_ID,

      hostname:
        os.hostname(),

      platform:
        os.platform(),

      arch:
        os.arch(),

      username:
        os.userInfo().username,

      connectedAt:
        new Date()

    }
  );


  console.log(
    "📡 Agent registration sent"
  );

});



/* =====================================================
   DISCONNECT
===================================================== */

socket.on(
  "disconnect",
  (reason)=>{

    console.log(
      "🔴 Disconnected:",
      reason
    );

  }
);



/* =====================================================
   SOCKET ERROR
===================================================== */

socket.on(
  "connect_error",
  (err)=>{

    console.error(
      "❌ Socket Error:",
      err.message
    );

  }
);



/* =====================================================
   HEARTBEAT
===================================================== */

setInterval(()=>{


  if(socket.connected){

    socket.emit(
      "heartbeat",
      {

        deviceId:
          AGENT_ID,

        timestamp:
          new Date()

      }
    );

  }


},30000);



/* =====================================================
   DRIVE DISCOVERY
===================================================== */

socket.on(
  "discover-drives",
  async(payload)=>{


    console.log(
      "📀 Drive discovery requested:",
      payload.userId
    );


    try {


      const drives =
        await runDriveDiscovery();



      console.log(
        "Discovered Drives:",
        JSON.stringify(
          drives,
          null,
          2
        )
      );



      socket.emit(
        "drive-list",
        {

          deviceId:
            AGENT_ID,


          userId:
            payload.userId,


          drives

        }
      );



      console.log(
        "📤 Drive list sent"
      );


    }
    catch(err){


      console.error(
        "❌ Drive discovery failed:",
        err.message
      );



      socket.emit(
        "drive-list",
        {

          deviceId:
            AGENT_ID,


          userId:
            payload.userId,


          drives: [],


          error:
            err.message

        }
      );


    }


  }
);




/* =====================================================
   START WIPE
===================================================== */

socket.on(
  "start-wipe",
  (job)=>{


    console.log(
      "▶ Starting wipe:",
      job.commandId
    );


    startWipeTask(
      socket,
      job
    );


  }
);




/* =====================================================
   CANCEL WIPE
===================================================== */

socket.on(
  "cancel-wipe",
  (job)=>{


    console.log(
      "⛔ Cancelling wipe:",
      job.commandId
    );


    cancelWipeTask(
      job.commandId
    );


  }
);




/* =====================================================
   EXPORT
===================================================== */

export default socket;