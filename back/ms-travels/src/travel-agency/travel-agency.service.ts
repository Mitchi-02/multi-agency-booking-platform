import { Injectable } from "@nestjs/common"
import { CreateTravelAgencyDto } from "./dto/create-travel-agency.dto"
import { InjectModel } from "@nestjs/mongoose"
import { TravelAgency } from "src/schemas/TravelAgency.schema"
import { Model } from "mongoose"
import { SearchAgenciesQueryDto } from "./dto/search-agencies-query.dto"
import { UpdateTravelAgencyDto } from "./dto/update-travel-agency.dto"
import { StorageService } from "src/storage/storage.service"
import { QueryCacheService } from "src/query-cache/query-cache.service"
import { KafkaService } from "src/kafka/kafka.service"
import { TravelAgencyDeletedEvent } from "src/kafka/core/travel-agencies/events"

@Injectable()
export class TravelAgencyService {
  static readonly DEFAULT_PAGE_SIZE = 10
  static readonly DEFAULT_PAGE = 1
  static readonly IMAGES_PATH = "travel-agencies/images/"
  static readonly LOGOS_PATH = "travel-agencies/logos/"

  constructor(
    @InjectModel(TravelAgency.name) private agencyModel: Model<TravelAgency>,
    private readonly storageService: StorageService,
    private readonly queryCacheService: QueryCacheService,
    private readonly kafkaService: KafkaService
  ) {}

  countAll({ is_complete, search }: { is_complete?: string; search?: string }) {
    const query = {}
    if (search) query["name"] = { $regex: search, $options: "i" }
    if (is_complete) query["is_complete"] = is_complete === "true" ? true : false
    return this.queryCacheService.get<number>({
      key: "AGENCIES_COUNT",
      promise: this.agencyModel.countDocuments(query),
      value: `${is_complete ?? "ALL"}_${search ?? "ALL"}`
    })
  }

  findAll(query: SearchAgenciesQueryDto) {
    const searchQuery = {}
    if (query.search) searchQuery["name"] = { $regex: query.search, $options: "i" }
    if (query.is_complete) searchQuery["is_complete"] = query.is_complete === "true" ? true : false
    const page = (query.page ?? TravelAgencyService.DEFAULT_PAGE) - 1
    const page_size = query.page_size ?? TravelAgencyService.DEFAULT_PAGE_SIZE
    return this.queryCacheService.get<TravelAgency[]>({
      key: "AGENCIES",
      promise: this.agencyModel.find(searchQuery, null, {
        skip: page_size * page,
        sort: { createdAt: -1 },
        limit: page_size
      }),
      value: `${page}_${page_size}_${query.is_complete ?? "ALL"}_${query.search ?? "ALL"}`
    })
  }

  findOne(id: string, isCompleteOnly?: boolean) {
    if (isCompleteOnly)
      return this.queryCacheService.get<TravelAgency>({
        key: "AGENCY_COMPLETE",
        value: id,
        promise: this.agencyModel.findOne({ _id: id, is_complete: true })
      })
    return this.queryCacheService.get<TravelAgency>({
      key: "AGENCY",
      value: id,
      promise: this.agencyModel.findById(id)
    })
  }

  //Admin Routes
  create(data: CreateTravelAgencyDto, isComplete?: boolean) {
    const d = {}
    const fields = ["description", "address", "phone", "contact_email", "rating"]
    fields.forEach((key) => {
      if (data[key]) d[key] = data[key]
    })
    if (data.logo) d["logo"] = this.storageService.saveOne(TravelAgencyService.LOGOS_PATH, data.logo)
    if (data.photos) d["photos"] = this.storageService.saveMany(TravelAgencyService.IMAGES_PATH, ...data.photos)
    return this.queryCacheService.set<TravelAgency>({
      key: "AGENCY",
      objectKeyValues: "_id",
      promise: this.agencyModel.create({
        ...d,
        rating: 5,
        name: data.name,
        social_media: JSON.parse(data.social_media),
        is_complete: isComplete ?? false
      }),
      invalidate: [
        { key: "AGENCIES", all: true },
        { key: "AGENCIES_COUNT", all: true }
      ]
    })
  }

  async remove(id: string) {
    const res = await this.queryCacheService.invalidate({
      promise: this.agencyModel.findByIdAndDelete(id),
      couples: [
        { key: "AGENCY", value: id },
        { key: "AGENCY_COMPLETE", value: id },
        { key: "AGENCIES", all: true },
        { key: "AGENCIES_COUNT", all: true }
      ]
    })
    if (res) this.kafkaService.sendTravelAgencyEvent(new TravelAgencyDeletedEvent({ id }))
    return res
  }

  //Admin - Travel Agent Routes
  async update(id: string, data: UpdateTravelAgencyDto) {
    const agency = await this.agencyModel.findById(id)
    if (!agency) return null
    const fields = ["name", "description", "address", "phone", "contact_email"]
    agency.is_complete = true
    agency.social_media = JSON.parse(data.social_media)
    fields.forEach((key) => {
      agency[key] = data[key]
    })
    if (data.logo) {
      this.storageService.delete(agency.logo)
      agency["logo"] = this.storageService.saveOne(TravelAgencyService.LOGOS_PATH, data.logo)
    }
    agency["photos"] = agency.photos
      .filter((p) => {
        if (data.deleted_photos?.find((f) => f.includes(p))) {
          this.storageService.delete(p)
          return false
        }
        return true
      })
      .concat(this.storageService.saveMany(TravelAgencyService.IMAGES_PATH, ...(data.new_photos ?? [])))

    await this.queryCacheService.set<TravelAgency>({
      key: "AGENCY",
      value: id,
      promise: agency.save(),
      invalidate: [
        { key: "AGENCY_COMPLETE", value: id },
        { key: "AGENCIES", all: true },
        { key: "AGENCIES_COUNT", all: true }
      ]
    })
    return agency
  }
}
