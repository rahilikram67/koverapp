import { resolver } from "@blitzjs/core/server"
import db from "db"

export default resolver.pipe(resolver.authorize(), async () => {
  const bestbuy = await db.universe.count({
    where: {
      source: "BEST_BUY",
    },
  })
  const harrods = await db.universe.count({
    where: {
      source: "HARRODS",
    },
  })

  return {
    count: {
      bestbuy: bestbuy ?? -1,
      harrods: harrods ?? -1,
    },
  }
})
