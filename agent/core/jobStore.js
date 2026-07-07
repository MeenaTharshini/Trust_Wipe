// agent/core/jobStore.js

// In-memory store for active jobs
const activeJobs = new Map();

/**
 * Create a new job entry
 */
export const createJob = (id) => {
  activeJobs.set(id, {
    cancelled: false,
    createdAt: new Date(),
    status: "running",
  });
};

/**
 * Cancel a job
 */
export const cancelJob = (id) => {
  if (activeJobs.has(id)) {
    const job = activeJobs.get(id);
    job.cancelled = true;
    job.status = "cancelled";
    job.cancelledAt = new Date();
  }
};

/**
 * Check if a job is cancelled
 */
export const isCancelled = (id) => {
  return activeJobs.get(id)?.cancelled === true;
};

/**
 * Remove a job from the store
 */
export const removeJob = (id) => {
  activeJobs.delete(id);
};

/**
 * Get job details
 */
export const getJob = (id) => {
  return activeJobs.get(id) || null;
};

/**
 * List all active jobs
 */
export const listJobs = () => {
  return Array.from(activeJobs.entries()).map(([id, data]) => ({
    id,
    ...data,
  }));
};
