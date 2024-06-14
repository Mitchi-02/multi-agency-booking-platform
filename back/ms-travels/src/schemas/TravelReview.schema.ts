import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import mongoose, { Document } from "mongoose"

export type TravelReviewDocument = Document & TravelReview

@Schema({
  timestamps: true,
  collection: "travel_reviews",
  toObject: { versionKey: false },
  toJSON: { versionKey: false }
})
export class TravelReview {
  _id: mongoose.Schema.Types.ObjectId

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "TravelBooking" })
  booking: string

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "TravelAgency" })
  agency: string

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Travel" })
  travel: string

  @Prop({ required: true, type: Number })
  user_id: number

  @Prop({ required: true, type: Number })
  rating: number

  @Prop({ required: true })
  comment: string
}

export const TravelReviewSchema = SchemaFactory.createForClass(TravelReview)
