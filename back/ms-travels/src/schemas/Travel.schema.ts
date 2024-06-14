import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import mongoose, { HydratedDocument } from "mongoose"
import { TravelAgency } from "./TravelAgency.schema"
import { StorageService } from "src/storage/storage.service"

export type TravelDocument = HydratedDocument<Travel>

export type ComplementaryService = {
  name: string
  price: number
  type: ComplementaryServiceType
}

export type PlanStep = {
  title: string
  description: string
}

export type TravelExperience = (typeof Travel.TRAVEL_EXPERIENCES)[number]

export type TravelRegion = (typeof Travel.REGIONS)[number]

export type TravelTransportationType = (typeof Travel.TRANSPORTATION_TYPES)[number]

export type ComplementaryServiceType = (typeof Travel.COMPLEMENTARY_SERVICES_TYPES)[number]

@Schema({ timestamps: true, collection: "travels", toObject: { versionKey: false }, toJSON: { versionKey: false } })
export class Travel {
  static readonly TRAVEL_EXPERIENCES = ["relaxation", "spiritual", "adventure", "cultural", "wildlife"] as const
  static readonly REGIONS = ["north america", "south america", "europe", "africa", "asia", "oceania", "other"] as const
  static readonly TRANSPORTATION_TYPES = ["plane", "train", "bus", "boat", "other"] as const
  static readonly COMPLEMENTARY_SERVICES_TYPES = [
    "documentation",
    "activities",
    "food",
    "transportation",
    "insurance",
    "other"
  ] as const

  _id: mongoose.Schema.Types.ObjectId

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "TravelAgency" })
  travel_agency: TravelAgency

  @Prop({ required: true, maxlength: 60 })
  title: string

  @Prop({ required: true })
  description: string

  @Prop({ required: true, maxlength: 60 })
  hotel: string

  @Prop({
    type: [String],
    required: true,
    transform: (a: string[]) => a.map((p: string) => `${StorageService.BASE_URL}${p}`)
  })
  photos: string[]

  @Prop({ required: true, type: Date })
  departure_date: Date

  @Prop({ required: true, type: Date })
  return_date: Date

  @Prop({ required: true, maxlength: 60 })
  departure_place: string

  @Prop({ required: true, type: Number })
  duration: number

  @Prop({ required: true, maxlength: 60 })
  destination: string

  @Prop({ required: true, type: Number })
  adult_price: number

  @Prop({ required: true, type: Number })
  kid_price: number

  @Prop({ required: true, type: Number })
  total_limit: number

  @Prop({ required: true, type: Number })
  places_left: number

  @Prop({
    type: [
      {
        name: String,
        price: Number,
        type: {
          type: String,
          enum: Travel.COMPLEMENTARY_SERVICES_TYPES
        }
      }
    ],
    default: [],
    _id: false
  })
  complementary_services: ComplementaryService[]

  @Prop({
    type: [
      {
        title: String,
        description: String
      }
    ],
    default: [],
    _id: false
  })
  plan: PlanStep[]

  @Prop({ required: true, type: [String], enum: Travel.TRAVEL_EXPERIENCES, default: [] })
  experiences: TravelExperience[]

  @Prop({ required: true, enum: Travel.REGIONS })
  region: TravelRegion

  @Prop({ required: true, enum: Travel.TRANSPORTATION_TYPES })
  transportation_type: TravelTransportationType
}

export const TravelSchema = SchemaFactory.createForClass(Travel)
