import bestBuyQueue from "background-process/queue/bestbuy"
import { BestBuyCategory } from "background-process/types/bestbuy"
import { resolver } from "blitz"
import categories from "data/extraction/bestbuy/categories.json"

export default resolver.pipe(resolver.authorize(), async () => {
  await Promise.all(
    categories.map(async (category: BestBuyCategory) => {
      await bestBuyQueue.add(`processBestbuyCategory-${category.id}`, category, {
        delay: 5000,
      })
    })
  )

  return {
    status: "Queued!",
  }
})
