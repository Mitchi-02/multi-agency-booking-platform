import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { HikeReview } from "src/schemas/HikeReview.schema"
import { CreateHikeReviewDto } from "./dto/create-review.dto"
import { PaginationQueryDto } from "src/utils/dto/pagination-query.dto"
import { QueryCacheService } from "src/query-cache/query-cache.service"
import { KafkaService } from "src/kafka/kafka.service"
import { HikeReviewCreatedEvent } from "src/kafka/core/hike-reviews/events"

@Injectable()
export class HikeReviewService {
  static readonly DEFAULT_PAGE_SIZE = 6
  static readonly DEFAULT_PAGE = 1
  constructor(
    @InjectModel(HikeReview.name) private hikeReviewModel: Model<HikeReview>,
    private readonly queryCacheService: QueryCacheService,
    private readonly kafkaService: KafkaService
  ) {}

  async create(user_id: number, data: CreateHikeReviewDto, agency: string, hike: string) {
    const newHikeReview = await this.queryCacheService.set<HikeReview>({
      key: "REVIEW",
      value: `${data.booking_id}_${user_id}`,
      promise: this.hikeReviewModel.create({
        ...data,
        booking: data.booking_id,
        user_id,
        hike,
        agency
      }),
      invalidate: [
        { key: "REVIEWS", all: true },
        { key: "REVIEWS_COUNT", all: true },
        { key: "REVIEWS_THREE", value: agency }
      ]
    })
    this.kafkaService.sendHikeReviewEvent(
      new HikeReviewCreatedEvent({
        id: newHikeReview._id,
        rating: newHikeReview.rating,
        comment: newHikeReview.comment,
        user_id,
        booking_id: data.booking_id,
        hike_id: hike,
        agency_id: agency
      })
    )
    return newHikeReview
  }

  findOne({ booking, user_id, agency_id }: { booking: string; user_id?: number; agency_id?: string }) {
    const query = {
      booking
    }
    if (agency_id) query["agency"] = agency_id
    if (user_id) query["user_id"] = user_id
    return this.queryCacheService.get<HikeReview>({
      key: "REVIEW",
      value: `${booking}_${user_id}`,
      promise: this.hikeReviewModel.findOne(query)
    })
  }
}
