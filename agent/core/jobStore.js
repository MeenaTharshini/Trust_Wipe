// agent/core/jobStore.js


/* =====================================================
   IN-MEMORY JOB STORE

   Stores active wipe jobs locally inside the agent
===================================================== */


const activeJobs = new Map();





/* =====================================================
   CREATE JOB
===================================================== */

export const createJob = (id) => {

    activeJobs.set(id, {

        cancelled: false,

        createdAt: new Date(),

        status: "running"

    });

};






/* =====================================================
   CANCEL JOB
===================================================== */

export const cancelJob = (id) => {


    if(activeJobs.has(id)) {


        const job = activeJobs.get(id);


        job.cancelled = true;


        job.status = "cancelled";


        job.cancelledAt = new Date();


        console.log(
            "⛔ Job cancelled:",
            id
        );

    }

};






/* =====================================================
   CHECK CANCEL STATUS
===================================================== */

export const isCancelled = (id) => {


    return (
        activeJobs.get(id)?.cancelled === true
    );


};






/* =====================================================
   REMOVE JOB
===================================================== */

export const removeJob = (id) => {


    activeJobs.delete(id);


};






/* =====================================================
   GET JOB
===================================================== */

export const getJob = (id) => {


    return (
        activeJobs.get(id) || null
    );


};






/* =====================================================
   LIST ACTIVE JOBS
===================================================== */

export const listJobs = () => {


    return Array.from(
        activeJobs.entries()
    )
    .map(([id,data]) => ({

        id,

        ...data

    }));


};






/* =====================================================
   CLEAR ALL JOBS
===================================================== */

export const clearJobs = () => {


    activeJobs.clear();


};