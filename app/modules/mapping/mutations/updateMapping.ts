import { resolver } from "blitz"
import db from "db"
import { MappingSchema } from "../validations"

export default resolver.pipe(resolver.zod(MappingSchema), resolver.authorize(), async (input) => {
  const record = await db.mapping.findFirst({
    where: {
      mappedTo: input.mappedTo,
    },
  })

  const id = record
    ? record.id
    : (
        await db.mapping.create({
          data: {
            ...input,
            mappedTo: input.mappedTo ? input.mappedTo : "BEST_BUY",
          },
          select: {
            id: true,
          },
        })
      ).id

  if (record) {
    const mapping = await db.mapping.update({
      where: {
        id,
      },
      data: input,
    })
    return mapping
  }

  return record
})
