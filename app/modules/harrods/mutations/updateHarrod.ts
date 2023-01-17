import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateHarrod = z.object({
  id: z.number(),
  name: z.string(),
})

export default resolver.pipe(
  resolver.zod(UpdateHarrod),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const harrod = await db.harrod.update({ where: { id }, data })

    return harrod
  }
)
