import bestBuyQueue from "background-process/queue/bestbuy"
import harrodsQueue from "background-process/queue/harrods"
import { resolver } from "blitz"

interface SourceType {
  source: string
}

export default resolver.pipe(resolver.authorize(), async ({ source }: SourceType) => {
  if (source === "HARRODS") await harrodsQueue.drain(true)

  if (source === "BEST_BUY") await bestBuyQueue.drain(true)

  return {
    status: "Queue Cleared!",
  }
})
