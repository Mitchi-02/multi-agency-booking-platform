import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import mongoose, { Document } from "mongoose"

export type TravelReviewDocument = Document & TravelReview

export type ReviewUser = {
  id: number
  first_name: string
  last_name: string
  address: string
  profile_picture: string
  reviews_count: number
}

@Schema({
  timestamps: true,
  collection: "travel_reviews",
  toObject: { versionKey: false },
  toJSON: { versionKey: false }
})
export class TravelReview {
  _id: mongoose.Schema.Types.ObjectId

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  booking: mongoose.Schema.Types.ObjectId

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  agency: mongoose.Schema.Types.ObjectId

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  travel: mongoose.Schema.Types.ObjectId

  @Prop({
    required: true,
    type: {
      id: Number,
      first_name: String,
      last_name: String,
      address: String,
      profile_picture: String,
      reviews_count: Number
    },
    _id: false
  })
  user: ReviewUser

  @Prop({ required: true, type: Number })
  rating: number

  @Prop({ required: true })
  comment: string
}

export const TravelReviewSchema = SchemaFactory.createForClass(TravelReview)
