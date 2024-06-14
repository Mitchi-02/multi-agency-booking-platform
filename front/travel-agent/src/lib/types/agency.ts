import * as z from "zod"
import { UpdateTravelAgencySchema } from "../schemas/agency"

export type UpdateTravelAgencySchemaType = z.infer<typeof UpdateTravelAgencySchema>
