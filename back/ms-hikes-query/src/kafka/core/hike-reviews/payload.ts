import { ObjectId } from "mongoose"

export class HikeReviewTopicPayload {
  public id: string | ObjectId
  public rating: number
  public comment: string
  public user_id: number
  public booking_id: string
  public hike_id: string
  public agency_id: string
  public reviews_count?: number

  constructor(
    id: string | ObjectId,
    rating: number,
    comment: string,
    user_id: number,
    booking_id: string,
    hike_id: string,
    agency_id: string,
    reviews_count?: number
  ) {
    this.id = id
    this.rating = rating
    this.comment = comment
    this.user_id = user_id
    this.booking_id = booking_id
    this.hike_id = hike_id
    this.agency_id = agency_id
    this.reviews_count = reviews_count
  }
}
