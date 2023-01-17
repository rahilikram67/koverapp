import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreateMockConnector = z.object({
  name: z.string(),
})

export default resolver.pipe(
  resolver.zod(CreateMockConnector),
  resolver.authorize(),
  async (input) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const mockConnector = await db.mockConnector.create({ data: input })

    return mockConnector
  }
)
