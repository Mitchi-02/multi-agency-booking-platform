import { Injectable } from "@nestjs/common"
import { AgencyRequest } from "src/schemas/AgencyRequest.schema"
import { InjectModel } from "@nestjs/mongoose"
import { Model, mongo } from "mongoose"
import { SearchRequestsQueryDto } from "./dto/search-requests-query.dto"
import { QueryCacheService } from "src/query-cache/query-cache.service"

@Injectable()
export class AgencyRequestService {
  static readonly DEFAULT_PAGE_SIZE = 10
  static readonly DEFAULT_PAGE = 1

  constructor(
    @InjectModel(AgencyRequest.name) private requestModel: Model<AgencyRequest>,
    private readonly queryCacheService: QueryCacheService
  ) {}

  async create(email: string) {
    const request = new this.requestModel({ email })
    try {
      await request.save()
      await this.queryCacheService.set<AgencyRequest>({
        key: "REQUEST",
        objectKeyValues: "_id",
        promise: request.save(),
        invalidate: [
          { key: "REQUESTS", all: true },
          { key: "REQUESTS_COUNT", value: "ALL" }
        ]
      })
    } catch (error: unknown) {
      if (error instanceof mongo.MongoError && error.code === 11000) {
        return false
      }
      throw error
    }
    return true
  }

  countAll() {
    return this.queryCacheService.get<number>({
      key: "REQUESTS_COUNT",
      value: "ALL",
      promise: this.requestModel.countDocuments()
    })
  }

  findAll(query: SearchRequestsQueryDto) {
    const searchQuery = {}
    if (query.status) searchQuery["status"] = query.status
    if (query.search) searchQuery["email"] = { $regex: query.search, $options: "i" }
    const page = (query.page ?? AgencyRequestService.DEFAULT_PAGE) - 1
    const page_size = query.page_size ?? AgencyRequestService.DEFAULT_PAGE_SIZE
    return this.queryCacheService.get<AgencyRequest[]>({
      key: "REQUESTS",
      promise: this.requestModel.find(searchQuery, null, {
        skip: page_size * page,
        sort: { createdAt: -1 },
        limit: page_size
      }),
      value: `${page}_${page_size}_${query.status ?? "ALL"}_${query.search ?? "ALL"}`
    })
  }

  findOne(id: string) {
    return this.queryCacheService.get<AgencyRequest>({
      key: "REQUEST",
      value: id,
      promise: this.requestModel.findById(id)
    })
  }

  update(id: string, status: string) {
    return this.queryCacheService.set<AgencyRequest>({
      key: "REQUEST",
      value: id,
      promise: this.requestModel.findByIdAndUpdate(id, { status }, { returnDocument: "after" }),
      invalidate: [
        { key: "REQUESTS", all: true },
        { key: "REQUESTS_COUNT", value: "ALL" }
      ]
    })
  }

  remove(id: string) {
    return this.queryCacheService.invalidate({
      promise: this.requestModel.findByIdAndDelete(id),
      couples: [
        { key: "REQUEST", value: id },
        { key: "REQUESTS", all: true },
        { key: "REQUESTS_COUNT", value: "ALL" }
      ]
    })
  }
}
