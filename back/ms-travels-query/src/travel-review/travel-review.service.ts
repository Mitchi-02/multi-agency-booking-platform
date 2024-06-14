import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { TravelReview } from "src/schemas/TravelReview.schema"
import { PaginationQueryDto } from "src/utils/dto/pagination-query.dto"
import { QueryCacheService } from "src/query-cache/query-cache.service"

@Injectable()
export class TravelReviewService {
  static readonly DEFAULT_PAGE_SIZE = 6
  static readonly DEFAULT_PAGE = 1
  constructor(
    @InjectModel(TravelReview.name) private travelReviewModel: Model<TravelReview>,
    private readonly queryCacheService: QueryCacheService
  ) {}
  
  findOne({ booking, user_id, agency_id }: { booking: string; user_id?: number; agency_id?: string }) {
    const query = {
      booking
    }
    if (agency_id) query["agency"] = agency_id
    if (user_id) query["user_id"] = user_id
    return this.queryCacheService.get<TravelReview>({
      key: "REVIEW",
      value: `${booking}_${user_id}`,
      promise: this.travelReviewModel.findOne(query)
    })
  }

  countAll(agency_id: string, travel_id?: string) {
    const q = { agency: agency_id }
    if (travel_id) q["travel"] = travel_id
    return this.queryCacheService.get<number>({
      key: "REVIEWS_COUNT",
      value: `${agency_id}_${travel_id ?? "ALL"}`,
      promise: this.travelReviewModel.countDocuments(q)
    })
  }

  findAll(query: PaginationQueryDto, agency_id: string, travel_id?: string) {
    const q = { agency: agency_id }
    if (travel_id) query["travel"] = travel_id
    const page = (+query.page || TravelReviewService.DEFAULT_PAGE) - 1
    const page_size = +query.page_size || TravelReviewService.DEFAULT_PAGE_SIZE
    return this.queryCacheService.get<TravelReview[]>({
      key: "REVIEWS",
      value: `${page}_${page_size}_${agency_id}_${travel_id ?? "ALL"}`,
      promise: this.travelReviewModel
        .find(q)
        .sort({ createdAt: -1 })
        .limit(page_size)
        .skip(page * page_size)
    })
  }

  findThreeHighestRated(agency: string) {
    return this.queryCacheService.get<TravelReview[]>({
      key: "REVIEWS_THREE",
      value: agency,
      promise: this.travelReviewModel.find({ agency }).sort({ rating: -1, createdAt: -1 }).limit(3)
    })
  }
}
