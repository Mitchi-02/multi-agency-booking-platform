import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import mongoose, { HydratedDocument } from "mongoose"
import { Hike } from "./Hike.schema"
import { HikeAgency } from "./HikeAgency.schema"

export type HikeBookingDocument = HydratedDocument<HikeBooking>

export enum BookingType {
  ADULT = "adult",
  KID = "kid"
}

export enum PaymentMethod {
  CASH = "cash",
  CARD = "card"
}

export enum BookingStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  CANCELLED = "cancelled"
}

export type BookingItemType = {
  _id?: mongoose.Types.ObjectId
  full_name: string
  phone: string
  chosen_services: string[]
  price: number
  type: BookingType
  status: BookingStatus
}

@Schema({
  timestamps: true,
  collection: "hike_bookings",
  toObject: { versionKey: false },
  toJSON: { versionKey: false }
})
export class HikeBooking {
  _id: mongoose.Schema.Types.ObjectId

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Hike" })
  hike: Hike

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "HikeAgency" })
  hike_agency: HikeAgency

  @Prop({ required: true, type: Number })
  user_id: number

  @Prop({ required: true, type: Number })
  price: number

  @Prop({
    type: [
      {
        full_name: String,
        phone: String,
        chosen_services: [String],
        type: {
          type: String,
          enum: BookingType
        },
        status: {
          type: String,
          enum: BookingStatus,
          default: BookingStatus.PENDING
        },
        price: Number
      }
    ],
    default: [],
    _id: true
  })
  booking_items: BookingItemType[]

  @Prop({ type: Boolean, default: false })
  paid: boolean

  @Prop({ type: String, enum: PaymentMethod, required: true, default: PaymentMethod.CARD })
  method: PaymentMethod
}

export const HikeBookingSchema = SchemaFactory.createForClass(HikeBooking)
