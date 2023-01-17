import { NotFoundError, resolver } from "blitz"
import db from "db"
import { z } from "zod"

const GetHarrod = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetHarrod), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const harrod = await db.harrod.findFirst({ where: { id } })

  if (!harrod) throw new NotFoundError()

  return harrod
})
