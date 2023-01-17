import { z } from "zod"

export const BestBuyData = z.object({
  apiKey: z.string().nonempty("Please enter the Bestbuy API key!"),
  categories: z.string().array(),
})

// export const BestBuyCategories = z.object({
//   categories: z.string().array().nonempty("Please select the Bestbuy Categories!"),
// })
