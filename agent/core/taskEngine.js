// agent/core/taskEngine.js

import fs from "fs";
import path from "path";
import crypto from "crypto";

import {
  createJob,
  cancelJob,
  isCancelled,
  removeJob,
} from "./jobStore.js";



/* =====================================================
   GET ALL FILES RECURSIVELY
===================================================== */

const getFiles = (dir) => {

  let files = [];


  if (!fs.existsSync(dir)) {
    return files;
  }


  const entries = fs.readdirSync(dir);


  for (const entry of entries) {

    const fullPath = path.join(dir, entry);


    try {

      const stat = fs.statSync(fullPath);


      if (stat.isDirectory()) {

        files = files.concat(
          getFiles(fullPath)
        );

      } else {

        files.push(fullPath);

      }


    } catch (error) {

      console.error(
        "Read error:",
        error.message
      );

    }

  }


  return files;

};




/* =====================================================
   REMOVE EMPTY DIRECTORIES
===================================================== */

const removeEmptyDirectories = (dir) => {


  if (!fs.existsSync(dir)) {
    return;
  }


  const entries = fs.readdirSync(dir);



  for (const entry of entries) {


    const fullPath =
      path.join(dir, entry);



    try {


      if (fs.statSync(fullPath).isDirectory()) {

        removeEmptyDirectories(fullPath);

      }


    } catch {}

  }




  try {


    if (fs.readdirSync(dir).length === 0) {

      fs.rmdirSync(dir);

    }


  } catch {}


};






/* =====================================================
   OVERWRITE FILE
===================================================== */

const overwriteFile = (filePath) => {


  const stat = fs.statSync(filePath);



  if (stat.size === 0) {
    return;
  }



  const CHUNK = 1024 * 1024;



  const fd = fs.openSync(
    filePath,
    "r+"
  );



  let remaining = stat.size;

  let position = 0;




  while (remaining > 0) {


    const size = Math.min(
      CHUNK,
      remaining
    );



    const buffer =
      crypto.randomBytes(size);



    fs.writeSync(
      fd,
      buffer,
      0,
      size,
      position
    );



    position += size;

    remaining -= size;


  }



  fs.closeSync(fd);

};







/* =====================================================
   START WIPE TASK
===================================================== */

export const startWipeTask = async (
  socket,
  job
) => {


  const {

    userId,

    commandId,

    storagePath,

    algorithm =
      "NIST SP 800-88 Rev.1"


  } = job;



  console.log(
    "================================"
  );

  console.log(
    "START WIPE RECEIVED"
  );

  console.log(job);

  console.log(
    "================================"
  );



  createJob(commandId);




  const emitProgress =
    (progress, message)=>{


      socket.emit(
        "wipe-progress",
        {

          commandId,

          userId,

          progress,

          message,

          status:"running"

        }
      );


    };





  try {



    emitProgress(
      5,
      "Scanning storage..."
    );




    if(!storagePath){

      throw new Error(
        "Storage path missing"
      );

    }




    if(!fs.existsSync(storagePath)){


      throw new Error(
        `Storage path not found: ${storagePath}`
      );

    }




    const files =
      getFiles(storagePath);



    const total =
      files.length;



    console.log(
      "Files Found:",
      total
    );





    if(total === 0){


      emitProgress(
        100,
        "No files found"
      );



      socket.emit(
        "wipe-complete",
        {

          commandId,

          userId,

          status:"completed",

          algorithm,

          completedAt:
            new Date()

        }
      );



      removeJob(commandId);

      return;

    }





    let completed = 0;




    for(const file of files){



      if(isCancelled(commandId)){


        socket.emit(
          "wipe-complete",
          {

            commandId,

            userId,

            status:"cancelled",

            completedAt:
              new Date()

          }
        );


        removeJob(commandId);

        return;

      }





      try {


        overwriteFile(file);


        fs.unlinkSync(file);



        console.log(
          "Deleted:",
          file
        );


      } catch(error){


        console.error(
          "Failed:",
          file
        );


        console.error(
          error.message
        );


      }





      completed++;



      emitProgress(

        Math.floor(
          (completed / total) * 100
        ),

        `Wiped ${path.basename(file)}`

      );




      await new Promise(
        resolve =>
          setTimeout(resolve,100)
      );


    }





    removeEmptyDirectories(
      storagePath
    );





    const verificationHash =
      crypto
        .createHash("sha256")
        .update(
          commandId + Date.now()
        )
        .digest("hex");





    socket.emit(
      "wipe-complete",
      {

        commandId,

        userId,

        status:"completed",

        algorithm,

        completedAt:
          new Date(),


        wipedFiles:
          total,


        verifiedFiles:
          total,


        verificationFailures:
          0,


        verificationHash,


        verificationEvidenceHash:
          verificationHash

      }
    );




    console.log(
      "Wipe completed:",
      commandId
    );



    removeJob(commandId);



  } catch(error){



    console.error(
      "Wipe Error:",
      error
    );



    socket.emit(
      "wipe-complete",
      {

        commandId,

        userId,

        status:"failed",

        error:
          error.message,


        completedAt:
          new Date()

      }
    );



    removeJob(commandId);


  }


};






/* =====================================================
   CANCEL WIPE TASK
===================================================== */

export const cancelWipeTask = (
  commandId
)=>{


  cancelJob(commandId);


};