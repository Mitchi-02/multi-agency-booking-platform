import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { HikeBooking } from "src/schemas/HikeBooking.schema"
import { PaginationQueryDto } from "src/utils/dto/pagination-query.dto"
import { QueryCacheService } from "src/query-cache/query-cache.service"

@Injectable()
export class HikeBookingService {
  static readonly DEFAULT_PAGE_SIZE = 6
  static readonly DEFAULT_PAGE = 1

  constructor(
    @InjectModel(HikeBooking.name) private hikeBookingModel: Model<HikeBooking>,
    private readonly queryCacheService: QueryCacheService
  ) {}

  async findAll(
    query: PaginationQueryDto,
    params: {
      hike_id?: string
      agency_id: string
    }
  ) {
    const paramsQuery = {
      "hike_agency._id": params.agency_id
    }
    if (params.hike_id) paramsQuery["hike._id"] = params.hike_id
    let { page, page_size } = query
    page = (+page || HikeBookingService.DEFAULT_PAGE) - 1
    page_size = +page_size || HikeBookingService.DEFAULT_PAGE_SIZE
    const [count, results] = await Promise.all([
      this.queryCacheService.get<number>({
        key: "BOOKINGS_COUNT",
        value: `${JSON.stringify(paramsQuery)}`,
        promise: this.hikeBookingModel.countDocuments(paramsQuery)
      }),
      this.queryCacheService.get<HikeBooking[]>({
        key: "BOOKINGS",
        value: `${page}_${page_size}_${JSON.stringify(paramsQuery)}`,
        promise: this.hikeBookingModel
          .find(paramsQuery)
          .sort({ createdAt: -1 })
          .limit(page_size)
          .skip(page * page_size)
      })
    ])
    return { count, results, page: page + 1, page_size }
  }

  findOne(params: { booking_id: string; agency_id: string }) {
    const query = {
      _id: params.booking_id,
      "hike_agency._id": params.agency_id
    }
    return this.queryCacheService.get<HikeBooking>({
      key: "BOOKING",
      value: JSON.stringify(query),
      promise: this.hikeBookingModel.findOne(query, null)
    })
  }
}
