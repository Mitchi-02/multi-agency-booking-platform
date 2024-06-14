import { Injectable } from "@nestjs/common"
import { CreateHikeAgencyDto } from "./dto/create-hike-agency.dto"
import { InjectModel } from "@nestjs/mongoose"
import { HikeAgency } from "src/schemas/HikeAgency.schema"
import { Model } from "mongoose"
import { SearchAgenciesQueryDto } from "./dto/search-agencies-query.dto"
import { UpdateHikeAgencyDto } from "./dto/update-hike-agency.dto"
import { StorageService } from "src/storage/storage.service"
import { QueryCacheService } from "src/query-cache/query-cache.service"
import { KafkaService } from "src/kafka/kafka.service"
import { HikeAgencyDeletedEvent } from "src/kafka/core/hike-agencies/events"

@Injectable()
export class HikeAgencyService {
  static readonly DEFAULT_PAGE_SIZE = 10
  static readonly DEFAULT_PAGE = 1
  static readonly IMAGES_PATH = "hike-agencies/images/"
  static readonly LOGOS_PATH = "hike-agencies/logos/"

  constructor(
    @InjectModel(HikeAgency.name) private agencyModel: Model<HikeAgency>,
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
    const page = (query.page ?? HikeAgencyService.DEFAULT_PAGE) - 1
    const page_size = query.page_size ?? HikeAgencyService.DEFAULT_PAGE_SIZE
    return this.queryCacheService.get<HikeAgency[]>({
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
      return this.queryCacheService.get<HikeAgency>({
        key: "AGENCY_COMPLETE",
        value: id,
        promise: this.agencyModel.findOne({ _id: id, is_complete: true })
      })
    return this.queryCacheService.get<HikeAgency>({
      key: "AGENCY",
      value: id,
      promise: this.agencyModel.findById(id)
    })
  }

  //Admin Routes
  create(data: CreateHikeAgencyDto, isComplete?: boolean) {
    const d = {}
    const fields = ["description", "address", "phone", "contact_email", "rating"]
    fields.forEach((key) => {
      if (data[key]) d[key] = data[key]
    })
    if (data.logo) d["logo"] = this.storageService.saveOne(HikeAgencyService.LOGOS_PATH, data.logo)
    if (data.photos) d["photos"] = this.storageService.saveMany(HikeAgencyService.IMAGES_PATH, ...data.photos)
    return this.queryCacheService.set<HikeAgency>({
      key: "AGENCY",
      objectKeyValues: "_id",
      promise: this.agencyModel.create({
        ...d,
        name: data.name,
        rating: 5,
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
    if (res) this.kafkaService.sendHikeAgencyEvent(new HikeAgencyDeletedEvent({ id }))
    return res
  }

  //Admin - Hike Agent Routes
  async update(id: string, data: UpdateHikeAgencyDto) {
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
      agency["logo"] = this.storageService.saveOne(HikeAgencyService.LOGOS_PATH, data.logo)
    }
    agency["photos"] = agency.photos
      .filter((p) => {
        if (data.deleted_photos?.find((f) => f.includes(p))) {
          this.storageService.delete(p)
          return false
        }
        return true
      })
      .concat(this.storageService.saveMany(HikeAgencyService.IMAGES_PATH, ...(data.new_photos ?? [])))

    await this.queryCacheService.set<HikeAgency>({
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
