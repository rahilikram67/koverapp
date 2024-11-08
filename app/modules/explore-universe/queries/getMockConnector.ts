import { NotFoundError, resolver } from "blitz"
import db from "db"
import { z } from "zod"

const GetMockConnector = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(
  resolver.zod(GetMockConnector),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const mockConnector = await db.mockConnector.findFirst({ where: { id } })

    if (!mockConnector) throw new NotFoundError()

    return mockConnector
  }
)
