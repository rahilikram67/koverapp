import { z } from "zod"

const SourceEnum = ["BEST_BUY", "HARRODS"] as const

export const MappingSchema = z.object({
  underwriterClassId: z.string().nonempty(),
  brand: z.string().nonempty(),
  name: z.string().nonempty(),
  description: z.string().nonempty(),
  variant: z.string().nonempty(),
  manufactureDate: z.string().nonempty(),
  assetValue: z.string().nonempty(),
  currency: z.string().optional().nullable(),
  mappedTo: z.enum(SourceEnum).optional(),
})
