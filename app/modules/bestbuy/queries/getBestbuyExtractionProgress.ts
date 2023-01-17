import bestBuyQueue from "background-process/queue/bestbuy"
import { resolver } from "blitz"

export default resolver.pipe(resolver.authorize(), async () => {
  const waitingJobs = await bestBuyQueue.getWaitingCount()
  const totalJobsInWorking = await bestBuyQueue.count()

  return {
    waitingJobs,
    totalJobsInWorking,
  }
})
