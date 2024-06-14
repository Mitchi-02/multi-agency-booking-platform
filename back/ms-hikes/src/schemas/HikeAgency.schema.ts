import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument, ObjectId } from "mongoose"
import { StorageService } from "src/storage/storage.service"

export type HikeAgencyDocument = HydratedDocument<HikeAgency>

@Schema({
  timestamps: true,
  collection: "hike_agencies",
  toObject: { versionKey: false },
  toJSON: { versionKey: false }
})
export class HikeAgency {
  _id: ObjectId

  @Prop({ required: true, maxlength: 40 })
  name: string

  @Prop({ required: false })
  description: string

  @Prop({ required: false, maxlength: 60 })
  address: string

  @Prop({ required: false, maxlength: 20 })
  phone: string

  @Prop({ required: false, maxlength: 50 })
  contact_email: string

  @Prop({ required: false, transform: (a: string) => `${StorageService.BASE_URL}${a}` })
  logo: string

  @Prop({
    required: true,
    type: [String],
    transform: (a: string[]) => a.map((p: string) => `${StorageService.BASE_URL}${p}`)
  })
  photos: string[]

  @Prop({ required: true, type: Map, of: String, _id: false })
  social_media: Record<string, string>

  @Prop({ required: true, max: 5, default: 0, type: Number })
  rating: number

  @Prop({ required: true, default: false })
  is_complete: boolean

  @Prop({ required: true, default: 0 })
  reviews_count: number
}

export const HikeAgencySchema = SchemaFactory.createForClass(HikeAgency)
