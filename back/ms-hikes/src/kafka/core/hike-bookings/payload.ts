import { ObjectId } from "mongoose"
import { BookingItemType } from "src/schemas/HikeBooking.schema"

export class HikeBookingTopicPayload {
  public id?: string | ObjectId
  public price?: string
  public user_id?: number
  public paid?: boolean
  public method?: string
  public hike_id?: string | ObjectId
  public agency_id?: string | ObjectId
  public hike_places_left?: number
  public hike_agency_name?: string
  public hike_destination?: string
  public hike_departure_date?: Date
  public booking_items?: BookingItemType[]

  constructor({
    id,
    price,
    user_id,
    paid,
    method,
    hike_id,
    agency_id,
    hike_places_left,
    hike_agency_name,
    hike_destination,
    hike_departure_date,
    booking_items
  }: {
    id?: string | ObjectId
    price?: string
    user_id?: number
    paid?: boolean
    method?: string
    hike_id?: string | ObjectId
    agency_id?: string | ObjectId
    hike_places_left?: number
    hike_agency_name?: string
    hike_destination?: string
    hike_departure_date?: Date
    booking_items?: BookingItemType[]
  }) {
    this.id = id
    this.price = price
    this.user_id = user_id
    this.paid = paid
    this.method = method
    this.hike_id = hike_id
    this.agency_id = agency_id
    this.hike_places_left = hike_places_left
    this.hike_agency_name = hike_agency_name
    this.hike_destination = hike_destination
    this.hike_departure_date = hike_departure_date
    this.booking_items = booking_items
  }
}
