import { resolver } from "blitz"
import db from "db"
import { Settings } from "../validations"

export default resolver.pipe(
  resolver.zod(Settings),
  resolver.authorize(),
  async ({ smtpHost, smtpPort, smtpPassword, smtpUsername }) => {
    const record = await db.setting.findFirst()

    const id = record
      ? record.id
      : (
          await db.setting.create({
            data: {
              smtpHost,
              smtpPort,
              smtpPassword,
              smtpUsername,
            },
            select: {
              id: true,
            },
          })
        ).id

    if (record) {
      const setting = await db.setting.update({
        where: {
          id,
        },
        data: {
          smtpHost,
          smtpPort,
          smtpPassword,
          smtpUsername,
        },
      })
      return setting
    }

    return record
  }
)
