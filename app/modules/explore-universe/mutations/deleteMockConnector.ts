import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const DeleteMockConnector = z.object({
  id: z.number(),
})

export default resolver.pipe(
  resolver.zod(DeleteMockConnector),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const mockConnector = await db.mockConnector.deleteMany({ where: { id } })

    return mockConnector
  }
)
