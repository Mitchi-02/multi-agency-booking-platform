import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import mongoose, { HydratedDocument } from "mongoose"

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

export type Travel = {
  _id: mongoose.Schema.Types.ObjectId
  destination: string
  departure_date: Date
}

export type TravelAgency = {
  _id: mongoose.Schema.Types.ObjectId
  name: string
}

export type BookingUser = {
  id: number
  first_name: string
  last_name: string
  email: string
  phone: string
  profile_picture: string
}

@Schema({
  timestamps: true,
  collection: "travel_bookings",
  toObject: { versionKey: false },
  toJSON: { versionKey: false }
})
export class TravelBooking {
  _id: mongoose.Schema.Types.ObjectId

  @Prop({
    type: {
      departure_date: {
        type: Date,
        required: true
      },
      destination: String
    },
    _id: true
  })
  travel: Travel

  @Prop({
    type: {
      name: String
    },
    _id: true
  })
  travel_agency: TravelAgency

  @Prop({
    type: {
      id: Number,
      first_name: String,
      last_name: String,
      email: String,
      phone: String,
      profile_picture: String
    },
    _id: false
  })
  user: BookingUser

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
