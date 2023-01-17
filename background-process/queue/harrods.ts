import getRedisConnection from "background-process/connection"
import { HarrodsCategory, HARRODS_QUEUE } from "background-process/types/harrods"
import { Queue, QueueScheduler } from "bullmq"
import { defaultQueueJobsConfig } from "./config"

const harrodsQueueScheduler = new QueueScheduler(HARRODS_QUEUE)
const harrodsQueue = new Queue<HarrodsCategory, any, string>(HARRODS_QUEUE, {
  connection: getRedisConnection(),
  defaultJobOptions: {
    ...defaultQueueJobsConfig,
  },
})

export { harrodsQueueScheduler }

export default harrodsQueue
