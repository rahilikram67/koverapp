import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateMockConnector = z.object({
  id: z.number(),
  name: z.string(),
})

export default resolver.pipe(
  resolver.zod(UpdateMockConnector),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const mockConnector = await db.mockConnector.update({ where: { id }, data })

    return mockConnector
  }
)
