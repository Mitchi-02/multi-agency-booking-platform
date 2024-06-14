import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { HikeReview } from "src/schemas/HikeReview.schema"
import { PaginationQueryDto } from "src/utils/dto/pagination-query.dto"
import { QueryCacheService } from "src/query-cache/query-cache.service"

@Injectable()
export class HikeReviewService {
  static readonly DEFAULT_PAGE_SIZE = 6
  static readonly DEFAULT_PAGE = 1
  constructor(
    @InjectModel(HikeReview.name) private hikeReviewModel: Model<HikeReview>,
    private readonly queryCacheService: QueryCacheService
  ) {}

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

  countAll(agency_id: string, hike_id?: string) {
    const q = { agency: agency_id }
    if (hike_id) q["hike"] = hike_id
    return this.queryCacheService.get<number>({
      key: "REVIEWS_COUNT",
      value: `${agency_id}_${hike_id ?? "ALL"}`,
      promise: this.hikeReviewModel.countDocuments(q)
    })
  }

  findAll(query: PaginationQueryDto, agency_id: string, hike_id?: string) {
    const q = { agency: agency_id }
    if (hike_id) query["hike"] = hike_id
    const page = (+query.page || HikeReviewService.DEFAULT_PAGE) - 1
    const page_size = +query.page_size || HikeReviewService.DEFAULT_PAGE_SIZE
    return this.queryCacheService.get<HikeReview[]>({
      key: "REVIEWS",
      value: `${page}_${page_size}_${agency_id}_${hike_id ?? "ALL"}`,
      promise: this.hikeReviewModel
        .find(q)
        .sort({ createdAt: -1 })
        .limit(page_size)
        .skip(page * page_size)
    })
  }

  findThreeHighestRated(agency: string) {
    return this.queryCacheService.get<HikeReview[]>({
      key: "REVIEWS_THREE",
      value: agency,
      promise: this.hikeReviewModel.find({ agency }).sort({ rating: -1, createdAt: -1 }).limit(3)
    })
  }
}
