import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import mongoose, { Document } from "mongoose"

export type HikeReviewDocument = Document & HikeReview

@Schema({ timestamps: true })
export class HikeReview {
  _id: mongoose.Schema.Types.ObjectId

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "HikeBooking" })
  booking: string

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "HikeAgency" })
  agency: string

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Hike" })
  hike: string

  @Prop({ required: true, type: Number })
  user_id: number

  @Prop({ required: true, type: Number })
  rating: number

  @Prop({ required: true })
  comment: string
}

export const HikeReviewSchema = SchemaFactory.createForClass(HikeReview)
