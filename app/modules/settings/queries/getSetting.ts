import { resolver } from "blitz"
import db from "db"

export default resolver.pipe(resolver.authorize(), async () => {
  const setting = await db.setting.findFirst()

  return setting
})
