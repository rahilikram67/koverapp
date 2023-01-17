import harrodsQueue from "background-process/queue/harrods"
import { HarrodsCategory } from "background-process/types/harrods"
import { resolver } from "blitz"
import categories from "data/extraction/harrods/categories.json"

export default resolver.pipe(resolver.authorize(), async () => {
  await Promise.all(
    categories.categories.map(async (category: HarrodsCategory) => {
      await harrodsQueue.add(`processBestbuyCategory-${category.url}`, category, {
        delay: 5000,
      })
    })
  )

  return {
    status: "Queued!",
  }
})
