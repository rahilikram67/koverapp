import { resolver } from "@blitzjs/core/server"
import { paginate } from "blitz"
import db from "db"
import { z } from "zod"

const SearchText = z.object({
  searchString: z.string().optional(),
  skip: z.number().optional(),
  take: z.number().optional(),
})

export default resolver.pipe(
  resolver.authorize(),
  resolver.zod(SearchText),
  async ({ searchString, skip = 0, take = 100 }) => {
    const {
      items: records,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () =>
        db.universe.count({
          where: {
            OR: [
              {
                name: {
                  contains: searchString,
                },
              },
              {
                productId: {
                  contains: searchString,
                },
              },
              {
                underwriterClassId: {
                  contains: searchString,
                },
              },
              {
                variant: {
                  contains: searchString,
                },
              },
              {
                description: {
                  contains: searchString,
                },
              },
              {
                brand: {
                  contains: searchString,
                },
              },
            ],
          },
        }),
      query: async () =>
        await db.universe.findMany({
          take,
          skip,
          where: {
            OR: [
              {
                name: {
                  contains: searchString,
                },
              },
              {
                productId: {
                  contains: searchString,
                },
              },
              {
                underwriterClassId: {
                  contains: searchString,
                },
              },
              {
                variant: {
                  contains: searchString,
                },
              },
              {
                description: {
                  contains: searchString,
                },
              },
              {
                brand: {
                  contains: searchString,
                },
              },
              {
                valueHistory: {
                  some: {
                    source: {
                      contains: searchString,
                    },
                  },
                },
              },
            ],
          },
          include: {
            valueHistory: {
              orderBy: {
                retrievalDate: "desc",
              },
              select: {
                retrievalDate: true,
                assetValue: true,
                currency: true,
                source: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        }),
    })

    return {
      records,
      nextPage,
      hasMore,
      count,
    }
  }
)
