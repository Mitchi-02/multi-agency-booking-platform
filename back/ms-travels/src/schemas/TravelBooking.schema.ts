import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import mongoose, { HydratedDocument } from "mongoose"
import { Travel } from "./Travel.schema"
import { TravelAgency } from "./TravelAgency.schema"

export type TravelBookingDocument = HydratedDocument<TravelBooking>

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
  collection: "travel_bookings",
  toObject: { versionKey: false },
  toJSON: { versionKey: false }
})
export class TravelBooking {
  _id: mongoose.Schema.Types.ObjectId

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Travel" })
  travel: Travel

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "TravelAgency" })
  travel_agency: TravelAgency

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

export const TravelBookingSchema = SchemaFactory.createForClass(TravelBooking)
