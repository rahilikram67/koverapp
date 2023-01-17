import { resolver } from "blitz"
import db from "db"

export default resolver.pipe(resolver.authorize(), async () => {
  const bestbuy = await db.bestbuy.findFirst()

  return bestbuy
})
