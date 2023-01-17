import { resolver } from "blitz"
import db from "db"
import { BestBuyData } from "../validations"

export default resolver.pipe(resolver.zod(BestBuyData), resolver.authorize(), async (data) => {
  const record = await db.bestbuy.findFirst()

  const id = record
    ? record.id
    : (
        await db.bestbuy.create({
          data,
          select: {
            id: true,
            categories: true,
          },
        })
      ).id

  if (record) {
    const bestbuy = await db.bestbuy.update({
      where: {
        id,
      },
      data,
    })
    return bestbuy
  }

  return record
})
