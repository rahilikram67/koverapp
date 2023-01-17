import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetMockConnectorsInput
  extends Pick<Prisma.MockConnectorFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetMockConnectorsInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: mockConnectors,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.mockConnector.count({ where }),
      query: (paginateArgs) => db.mockConnector.findMany({ ...paginateArgs, where, orderBy }),
    })

    return {
      mockConnectors,
      nextPage,
      hasMore,
      count,
    }
  }
)
