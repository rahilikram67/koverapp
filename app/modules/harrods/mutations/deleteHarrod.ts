import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const DeleteHarrod = z.object({
  id: z.number(),
})

export default resolver.pipe(resolver.zod(DeleteHarrod), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const harrod = await db.harrod.deleteMany({ where: { id } })

  return harrod
})
