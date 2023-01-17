import { z } from "zod"

export const Settingsform = z.object({
  smtpHost: z.string().nonempty("Please enter the  Smtp Host!"),
  smtpPort: z.string().nonempty("Please enter the  Smtp Port!"),
  smtpUsername: z.string().nonempty("Please enter the Bestbuy API key!"),
  smtpPassword: z.string().nonempty("Please enter the Bestbuy API key!"),
})
export const Settings = z.object({
  smtpHost: z.string().nonempty("Please enter the  Smtp Host!"),
  smtpPort: z.number(),
  smtpUsername: z.string().nonempty("Please enter the Bestbuy API key!"),
  smtpPassword: z.string().nonempty("Please enter the Bestbuy API key!"),
})
