import { resolver } from "blitz"
import db from "db"
import { MappingSourceType } from "../types/Mapping.types"

export default resolver.pipe(resolver.authorize(), async (source: MappingSourceType) => {
  const mapping = await db.mapping.findFirst({
    where: {
      mappedTo: source,
    },
  })

  return mapping
})
