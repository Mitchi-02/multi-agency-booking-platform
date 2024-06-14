import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { TravelReview } from "src/schemas/TravelReview.schema"
import { CreateTravelReviewDto } from "./dto/create-review.dto"
import { QueryCacheService } from "src/query-cache/query-cache.service"
import { KafkaService } from "src/kafka/kafka.service"
import { TravelReviewCreatedEvent } from "src/kafka/core/travel-reviews/events"

@Injectable()
export class TravelReviewService {
  static readonly DEFAULT_PAGE_SIZE = 6
  static readonly DEFAULT_PAGE = 1
  constructor(
    @InjectModel(TravelReview.name) private travelReviewModel: Model<TravelReview>,
    private readonly queryCacheService: QueryCacheService,
    private readonly kafkaService: KafkaService
  ) {}

  async create(user_id: number, data: CreateTravelReviewDto, agency: string, travel: string) {
    const newTravelReview = await this.queryCacheService.set<TravelReview>({
      key: "REVIEW",
      value: `${data.booking_id}_${user_id}`,
      promise: this.travelReviewModel.create({
        ...data,
        booking: data.booking_id,
        user_id,
        travel,
        agency
      }),
      invalidate: [
        { key: "REVIEWS", all: true },
        { key: "REVIEWS_COUNT", all: true },
        { key: "REVIEWS_THREE", value: agency }
      ]
    })
    this.kafkaService.sendTravelReviewEvent(
      new TravelReviewCreatedEvent({
        id: newTravelReview._id,
        rating: newTravelReview.rating,
        comment: newTravelReview.comment,
        user_id,
        booking_id: data.booking_id,
        travel_id: travel,
        agency_id: agency
      })
    )
    return newTravelReview
  }

  findOne({
    booking,
    user_id,
    agency_id
  }: {
    booking: string
    user_id?: number
    agency_id?: string
  }) {
    const query = {
      booking,
    }
    if (agency_id) query["agency"] = agency_id
    if (user_id) query["user_id"] = user_id
    return this.queryCacheService.get<TravelReview>({
      key: "REVIEW",
      value: `${booking}_${user_id}`,
      promise: this.travelReviewModel.findOne(query)
    })
  }
}
