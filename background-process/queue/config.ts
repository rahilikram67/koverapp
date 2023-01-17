import { JobsOptions } from "bullmq"

export const WorkersCRON = {
  text: "One Hour",
  cron: "* */1 * * *",
  timezone: "Asia/Singapore",
}

export const defaultQueueJobsConfig: JobsOptions = {
  delay: 1000,
  attempts: 3,
  backoff: {
    type: "exponential",
    delay: 2000,
  },
}
