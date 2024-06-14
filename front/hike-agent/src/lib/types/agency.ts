import * as z from "zod"
import { UpdateHikeAgencySchema } from "../schemas/agency"

export type UpdateHikeAgencySchemaType = z.infer<typeof UpdateHikeAgencySchema>
