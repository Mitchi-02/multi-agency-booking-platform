import { ObjectId } from "mongoose"
import { BookingItemType } from "src/schemas/TravelBooking.schema"

export class TravelBookingTopicPayload {
  public id?: string | ObjectId
  public price?: string
  public user_id?: number
  public paid?: boolean
  public method?: string
  public travel_id?: string | ObjectId
  public agency_id?: string | ObjectId
  public travel_places_left?: number
  public travel_agency_name?: string
  public travel_destination?: string
  public travel_departure_date?: Date
  public booking_items?: BookingItemType[]

  constructor({
    id,
    price,
    user_id,
    paid,
    method,
    travel_id,
    agency_id,
    travel_places_left,
    travel_agency_name,
    travel_destination,
    travel_departure_date,
    booking_items
  }: {
    id?: string | ObjectId
    price?: string
    user_id?: number
    paid?: boolean
    method?: string
    travel_id?: string | ObjectId
    agency_id?: string | ObjectId
    travel_places_left?: number
    travel_agency_name?: string
    travel_destination?: string
    travel_departure_date?: Date
    booking_items?: BookingItemType[]
  }) {
    this.id = id
    this.price = price
    this.user_id = user_id
    this.paid = paid
    this.method = method
    this.travel_id = travel_id
    this.agency_id = agency_id
    this.travel_places_left = travel_places_left
    this.travel_agency_name = travel_agency_name
    this.travel_destination = travel_destination
    this.travel_departure_date = travel_departure_date
    this.booking_items = booking_items
  }
}
