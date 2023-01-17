import getRedisConnection from "background-process/connection"
import { BestBuyCategory, BEST_BUY_QUEUE } from "background-process/types/bestbuy"
import { Queue, QueueScheduler } from "bullmq"
import { defaultQueueJobsConfig } from "./config"

const bestBuyQueueScheduler = new QueueScheduler(BEST_BUY_QUEUE)
const bestBuyQueue = new Queue<BestBuyCategory, any, string>(BEST_BUY_QUEUE, {
  connection: getRedisConnection(),
  defaultJobOptions: {
    ...defaultQueueJobsConfig,
  },
})

export { bestBuyQueueScheduler }

export default bestBuyQueue
