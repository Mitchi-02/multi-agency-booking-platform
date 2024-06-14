import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import mongoose, { HydratedDocument } from "mongoose"
import { HikeAgency } from "./HikeAgency.schema"
import { StorageService } from "src/storage/storage.service"

export type HikeDocument = HydratedDocument<Hike>

export type ComplementaryService = {
  name: string
  price: number
  type: ComplementaryServiceType
}

export type PlanStep = {
  title: string
  description: string
}

export type ComplementaryServiceType = (typeof Hike.COMPLEMENTARY_SERVICES_TYPES)[number]

@Schema({ timestamps: true, collection: "hikes", toObject: { versionKey: false }, toJSON: { versionKey: false } })
export class Hike {
  static readonly COMPLEMENTARY_SERVICES_TYPES = [
    "documentation",
    "activities",
    "food",
    "transportation",
    "insurance",
    "other"
  ] as const

  _id: mongoose.Schema.Types.ObjectId

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "HikeAgency", required: true })
  hike_agency: HikeAgency

  @Prop({ required: true, maxlength: 60 })
  title: string

  @Prop({ required: true })
  description: string

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
    type: [String],
    required: true,
    transform: (a: string[]) => a.map((p: string) => `${StorageService.BASE_URL}${p}`)
  })
  photos: string[]

  @Prop({
    type: [
      {
        name: String,
        price: Number,
        type: {
          type: String,
          enum: Hike.COMPLEMENTARY_SERVICES_TYPES
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
}

export const HikeSchema = SchemaFactory.createForClass(Hike)
