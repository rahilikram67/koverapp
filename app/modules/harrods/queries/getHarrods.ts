import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetHarrodsInput
  extends Pick<Prisma.HarrodFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetHarrodsInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: harrods,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.harrod.count({ where }),
      query: (paginateArgs) => db.harrod.findMany({ ...paginateArgs, where, orderBy }),
    })

    return {
      harrods,
      nextPage,
      hasMore,
      count,
    }
  }
)
