import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { TravelBooking } from "src/schemas/TravelBooking.schema"
import { PaginationQueryDto } from "src/utils/dto/pagination-query.dto"
import { QueryCacheService } from "src/query-cache/query-cache.service"

@Injectable()
export class TravelBookingService {
  static readonly DEFAULT_PAGE_SIZE = 6
  static readonly DEFAULT_PAGE = 1

  constructor(
    @InjectModel(TravelBooking.name) private travelBookingModel: Model<TravelBooking>,
    private readonly queryCacheService: QueryCacheService
  ) {}

  async findAll(
    query: PaginationQueryDto,
    params: {
      travel_id?: string
      agency_id: string
    }
  ) {
    const paramsQuery = {
      'travel_agency._id': params.agency_id
    }
    if (params.travel_id) paramsQuery["travel._id"] = params.travel_id
    let { page, page_size } = query
    page = (+page || TravelBookingService.DEFAULT_PAGE) - 1
    page_size = +page_size || TravelBookingService.DEFAULT_PAGE_SIZE
    const [count, results] = await Promise.all([
      this.queryCacheService.get<number>({
        key: "BOOKINGS_COUNT",
        value: `${JSON.stringify(paramsQuery)}`,
        promise: this.travelBookingModel.countDocuments(paramsQuery)
      }),
      this.queryCacheService.get<TravelBooking[]>({
        key: "BOOKINGS",
        value: `${page}_${page_size}_${JSON.stringify(paramsQuery)}`,
        promise: this.travelBookingModel
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
      'travel_agency._id': params.agency_id
    }
    return this.queryCacheService.get<TravelBooking>({
      key: "BOOKING",
      value: JSON.stringify(query),
      promise: this.travelBookingModel.findOne(query, null)
    })
  }
}
