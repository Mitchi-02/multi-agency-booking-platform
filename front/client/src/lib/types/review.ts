import * as z from "zod"
import { ReviewSchema } from "../schemas/review"

export type ReviewSchemaType = z.infer<typeof ReviewSchema>
