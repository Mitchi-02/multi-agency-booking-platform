import * as z from "zod"

export const ReviewSchema = z.object({
  rating: z.number().min(0).max(5),
  comment: z.string().min(1)
})
