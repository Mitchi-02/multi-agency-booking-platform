export class HikeBookingTopicPayload {
  public id?: string
  public price?: string
  public user_id?: number
  public paid?: boolean
  public method?: string
  public travel_id?: string
  public agency_id?: string
  public travel_places_left?: number

  constructor({
    id,
    price,
    user_id,
    paid,
    method,
    travel_id,
    agency_id,
    travel_places_left
  }: {
    id?: string
    price?: string
    user_id?: number
    paid?: boolean
    method?: string
    travel_id?: string
    agency_id?: string
    travel_places_left?: number
  }) {
    this.id = id
    this.price = price
    this.user_id = user_id
    this.paid = paid
    this.method = method
    this.travel_id = travel_id
    this.agency_id = agency_id
    this.travel_places_left = travel_places_left
  }
}
