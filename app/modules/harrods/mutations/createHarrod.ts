import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreateHarrod = z.object({
  name: z.string(),
})

export default resolver.pipe(resolver.zod(CreateHarrod), resolver.authorize(), async (input) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const harrod = await db.harrod.create({ data: input })

  return harrod
})
