import { log } from "@blitzjs/display"
import { config } from "dotenv"
import cron from "node-cron"
import bestBuyQueue from "./queue/bestbuy"
import { WorkersCRON } from "./queue/config"
import harrodsQueue from "./queue/harrods"
import { REPEATABLE_JOB_ID, REPEATABLE_JOB_NAME } from "./types/default"
import bestBuyWorker from "./worker/bestbuy"
import harrodsWorker from "./worker/harrods"

config()

log.success("[Queue] Initialized Worker: " + bestBuyWorker.name)
log.success("[Queue] Initialized Worker: " + harrodsWorker.name)

const drain = async () => {
  await bestBuyQueue.drain(true)
  await harrodsQueue.drain(true)
}

const init = async () => {
  if (process.env.DRAIN_QUEUE === "true") {
    try {
      await drain()
      log.success(`[Queue] Drained Successfully!`)
    } catch (e) {
      log.error(
        `[Queue] There was an error while draining! Make sure you are using the same cron you used to enqueue workers earlier.`
      )
    }

    process.exit(0)
  }

  /* Initial job to run for the first time */
  await bestBuyQueue.add("initialBestbuyExtraction", {
    id: REPEATABLE_JOB_ID,
    name: REPEATABLE_JOB_NAME,
  })

  /* Initial job to run for the first time */
  await harrodsQueue.add("initialHarrodsExtraction", {
    name: REPEATABLE_JOB_NAME,
    url: REPEATABLE_JOB_NAME,
  })

  cron.schedule(
    WorkersCRON.cron,
    async () => {
      /* Repeatable job starts after the next cron start */
      await bestBuyQueue.add("repeatableBestbuyExtraction", {
        id: REPEATABLE_JOB_ID,
        name: REPEATABLE_JOB_NAME,
      })
      log.success(`[Bestbuy] Enqueued ${WorkersCRON.text} Repeatable Job (${WorkersCRON.cron})!`)

      /* Repeatable job starts after the next cron start */
      await harrodsQueue.add("repeatableHarrodsExtraction", {
        name: REPEATABLE_JOB_NAME,
        url: REPEATABLE_JOB_NAME,
      })
      log.success(`[Harrods] Enqueued ${WorkersCRON.text} Repeatable Job (${WorkersCRON.cron})!`)
    },
    {
      timezone: WorkersCRON.timezone,
    }
  )
}

init()
