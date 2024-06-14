import * as z from "zod"
import { AddHikingAgencySchema, AddTravelAgencySchema, UpdateHikeAgencySchema, UpdateRequestSchema, UpdateTravelAgencySchema } from "../schemas/agency"

export type AddTravelAgencySchemaType = z.infer<typeof AddTravelAgencySchema>
export type AddHikingAgencySchemaType = z.infer<typeof AddHikingAgencySchema>
export type UpdateRequestSchemaType = z.infer<typeof UpdateRequestSchema>
export type UpdateTravelAgencySchemaType = z.infer<typeof UpdateTravelAgencySchema>
export type UpdateHikeAgencySchemaType = z.infer<typeof UpdateHikeAgencySchema>