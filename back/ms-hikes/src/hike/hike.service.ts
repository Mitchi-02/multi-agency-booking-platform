import { Injectable } from "@nestjs/common"
import { CreateHikeDto } from "./dto/create-hike.dto"
import { UpdateHikeDto } from "./dto/update-hike.dto"
import { Hike } from "src/schemas/Hike.schema"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { StorageService } from "src/storage/storage.service"
import { SearchHikesQueryDto } from "./dto/search-hikes-query.dto"
import { HikeAgency } from "src/schemas/HikeAgency.schema"
import { SuggestHikesQueryDto } from "./dto/suggest-travels-query.dto"
import { QueryCacheService } from "src/query-cache/query-cache.service"
import { KafkaService } from "src/kafka/kafka.service"
import { HikeDeletedEvent } from "src/kafka/core/hikes/events"

type PaginatedHikes = {
  count: number
  results: Hike[]
}
@Injectable()
export class HikeService {
  static readonly DEFAULT_PAGE_SIZE = 6
  static readonly DEFAULT_SUGGEST_PAGE_SIZE = 3
  static readonly DEFAULT_AGENT_PAGE_SIZE = 10
  static readonly DEFAULT_PAGE = 1
  static readonly IMAGES_PATH = "hikes/"

  constructor(
    @InjectModel(Hike.name) private hikeModel: Model<Hike>,
    private readonly storageService: StorageService,
    private readonly queryCacheService: QueryCacheService,
    private readonly kafkaService: KafkaService
  ) {}

  getFilters() {
    return {
      complementary_services_types: Hike.COMPLEMENTARY_SERVICES_TYPES.map((t, index) => ({ id: index, name: t }))
    }
  }

  findAll(query: SearchHikesQueryDto) {
    const searchQuery = this.generateClientFilter(query)
    const page = (query.page ?? HikeService.DEFAULT_PAGE) - 1
    const page_size = query.page_size ?? HikeService.DEFAULT_PAGE_SIZE
    return this.queryCacheService
      .get<PaginatedHikes[]>({
        key: "HIKES_CLIENT",
        promise: this.hikeModel.aggregate<PaginatedHikes>([
          {
            $facet: {
              results: [
                {
                  $project: {
                    title: 1,
                    description: 1,
                    departure_date: 1,
                    return_date: 1,
                    departure_place: 1,
                    destination: 1,
                    adult_price: 1,
                    kid_price: 1,
                    places_left: 1,
                    photos: {
                      $map: {
                        input: { $slice: ["$photos", 1] },
                        as: "photo",
                        in: {
                          $concat: [StorageService.BASE_URL, "$$photo"]
                        }
                      }
                    },
                    duration: 1,
                    complementary_services: {
                      name: 1,
                      type: 1
                    },
                    hike_agency: 1
                  }
                },
                {
                  $lookup: {
                    from: "hike_agencies",
                    localField: "hike_agency",
                    foreignField: "_id",
                    as: "hike_agency",
                    pipeline: [
                      {
                        $project: {
                          name: 1,
                          rating: 1,
                          reviews_count: 1
                        }
                      }
                    ]
                  }
                },
                { $unwind: "$hike_agency" },
                {
                  $match: searchQuery.length > 0 ? { $and: searchQuery } : {}
                },
                { $sort: { departure_date: 1 } }
              ]
            }
          },
          {
            $addFields: {
              count: { $size: "$results" },
              results: {
                $slice: ["$results", page_size * page, page_size]
              }
            }
          }
        ]),
        value: `${page}_${page_size}_${JSON.stringify(searchQuery)}`
      })
      .then((res) => res[0])
  }

  findOne(id: string, agency_id?: string) {
    if (agency_id)
      return this.queryCacheService.get<Hike>({
        key: "HIKE_BY_AGENCY",
        value: `${id}_${agency_id}`,
        promise: this.hikeModel.findOne({ _id: id, hike_agency: agency_id })
      })
    return this.queryCacheService.get<Hike>({
      key: "HIKE_CLIENT",
      value: id,
      promise: this.hikeModel.findById(id).populate<{ hike_agency: HikeAgency }>({
        path: "hike_agency",
        select: "name _id rating address logo photos reviews_count"
      })
    })
  }

  suggestByAgency(agency_id: string, query: SuggestHikesQueryDto) {
    const filter = {
      hike_agency: agency_id,
      places_left: {
        $ne: 0
      }
    }
    const page_size = query.page_size ?? HikeService.DEFAULT_SUGGEST_PAGE_SIZE
    if (query.exclude) filter["_id"] = { $ne: query.exclude }
    return this.queryCacheService.get<Hike[]>({
      key: "HIKES_SUGGEST",
      promise: this.hikeModel
        .find(filter, {
          title: 1,
          hike_agency: 1,
          destination: 1,
          photos: 1
        })
        .populate<{ hike_agency: HikeAgency }>({
          path: "hike_agency",
          select: "_id rating reviews_count"
        })
        .sort({ departure_date: 1 })
        .limit(page_size),
      value: `${page_size}_${agency_id}_${query.exclude ?? "ALL"}`
    })
  }

  countMine(query: SearchHikesQueryDto, auth_org: string) {
    const searchQuery = this.generateAgencyFilter(query, auth_org)
    return this.queryCacheService.get<number>({
      key: "HIKES_COUNT_BY_AGENCY",
      promise: this.hikeModel.countDocuments({
        $and: searchQuery
      }),
      value: JSON.stringify(searchQuery)
    })
  }

  //Hike Agent Routes
  findMine(query: SearchHikesQueryDto, auth_org: string) {
    const searchQuery = this.generateAgencyFilter(query, auth_org)
    const page = (query.page ?? HikeService.DEFAULT_PAGE) - 1
    const page_size = query.page_size ?? HikeService.DEFAULT_AGENT_PAGE_SIZE
    return this.queryCacheService.get<Hike[]>({
      key: "HIKES_BY_AGENCY",
      promise: this.hikeModel.find(
        {
          $and: searchQuery
        },
        {
          total_limit: 1,
          departure_place: 1,
          departure_date: 1,
          return_date: 1,
          destination: 1,
          places_left: 1,
          hike_agency: 1
        },
        {
          skip: page_size * page,
          sort: { createdAt: -1 },
          limit: page_size
        }
      ),
      value: `${page}_${query.page_size ?? HikeService.DEFAULT_PAGE_SIZE}_${JSON.stringify(searchQuery)}`
    })
  }

  create(data: CreateHikeDto, agency_id: string) {
    const d = {}
    const fields = [
      "title",
      "description",
      "departure_date",
      "return_date",
      "departure_place",
      "destination",
      "total_limit",
      "adult_price",
      "kid_price"
    ]
    fields.forEach((key) => {
      d[key] = data[key]
    })
    if (data.photos) d["photos"] = this.storageService.saveMany(HikeService.IMAGES_PATH, ...data.photos)
    return this.queryCacheService.invalidate({
      couples: [
        { key: "HIKES_CLIENT", all: true },
        { key: "HIKES_SUGGEST", all: true },
        { key: "HIKES_BY_AGENCY", all: true },
        { key: "HIKES_COUNT_BY_AGENCY", all: true }
      ],
      promise: this.hikeModel.create({
        ...d,
        plan: data.plan?.map((p) => JSON.parse(p)),
        places_left: data.total_limit,
        complementary_services: data.complementary_services?.map((p) => JSON.parse(p)),
        //duration in days
        duration: Math.ceil(
          (new Date(data.return_date).getTime() - new Date(data.departure_date).getTime()) / (1000 * 60 * 60 * 24)
        ),
        hike_agency: agency_id
      })
    })
  }

  async remove(id: string, agency_id: string) {
    const res = await this.queryCacheService.invalidate({
      couples: [
        { key: "HIKE_CLIENT", value: id },
        { key: "HIKE_BY_AGENCY", value: `${id}_${agency_id}` },
        { key: "HIKES_CLIENT", all: true },
        { key: "HIKES_SUGGEST", all: true },
        { key: "HIKES_BY_AGENCY", all: true },
        { key: "HIKES_COUNT_BY_AGENCY", all: true },
        { key: "BOOKING", all: true },
        { key: "BOOKINGS", all: true }
      ],
      promise: this.hikeModel.findByIdAndDelete(id)
    })
    if (res) this.kafkaService.sendHikeEvent(new HikeDeletedEvent({ id }))
    return res
  }

  async update(id: string, data: UpdateHikeDto, agency_id: string) {
    const agency = await this.hikeModel.findOne({ _id: id, hike_agency: agency_id })
    if (!agency) return null
    const fields = [
      "title",
      "description",
      "departure_date",
      "return_date",
      "departure_place",
      "destination",
      "total_limit",
      "adult_price",
      "kid_price",
      "places_left"
    ]
    fields.forEach((key) => {
      if (data[key]) agency[key] = data[key]
    })
    if (data.plan) agency.plan = data.plan.map((p) => JSON.parse(p))
    if (data.complementary_services)
      agency.complementary_services = data.complementary_services.map((p) => JSON.parse(p))
    agency["photos"] = agency.photos
      .filter((p) => {
        if (data.deleted_photos?.find((f) => f.includes(p))) {
          this.storageService.delete(p)
          return false
        }
        return true
      })
      .concat(this.storageService.saveMany(HikeService.IMAGES_PATH, ...(data.new_photos ?? [])))

    await this.queryCacheService.invalidate({
      couples: [
        { key: "HIKE_CLIENT", value: id },
        { key: "HIKE_BY_AGENCY", value: `${id}_${agency_id}` },
        { key: "HIKES_CLIENT", all: true },
        { key: "HIKES_SUGGEST", all: true },
        { key: "HIKES_BY_AGENCY", all: true },
        { key: "HIKES_COUNT_BY_AGENCY", all: true },
        { key: "BOOKING", all: true },
        { key: "BOOKINGS", all: true }
      ],
      promise: agency.save()
    })
    return agency
  }

  //utils
  private generateClientFilter(query: SearchHikesQueryDto) {
    const searchQuery = []
    if (query.title) searchQuery.push({ title: { $regex: query.title, $options: "i" } })
    if (query.destination) searchQuery.push({ destination: { $regex: query.destination, $options: "i" } })
    if (query.durations !== undefined && typeof query.durations === "string") {
      const duration = this.readDuration(query.durations)
      if (duration) searchQuery.push({ duration })
    } else if (query.durations !== undefined && Array.isArray(query.durations)) {
      const duration = query.durations.map((d) => this.readDuration(d)).filter((d) => d !== null)
      if (duration.length > 0) searchQuery.push({ $or: duration })
    }

    let priceQuery = null
    if (query.price_min !== undefined) priceQuery = { $gte: query.price_min }
    if (query.price_max !== undefined)
      priceQuery == null ? (priceQuery = { $lte: query.price_max }) : (priceQuery["$lte"] = query.price_max)

    if (priceQuery !== null) {
      searchQuery.push({ $or: [{ adult_price: priceQuery }, { kid_price: priceQuery }] })
    }

    if (query.departure_date)
      searchQuery.push({
        departure_date: {
          $gte: new Date(query.departure_date.setHours(0, 0, 0)),
          $lte: new Date(query.departure_date.setHours(23, 59, 59))
        }
      })

    if (query.return_date)
      searchQuery.push({
        return_date: {
          $gte: new Date(query.return_date.setHours(0, 0, 0)),
          $lte: new Date(query.return_date.setHours(23, 59, 59))
        }
      })
    if (query.search) {
      searchQuery.push({
        $or: [
          { departure_place: { $regex: query.search, $options: "i" } },
          { "hike_agency.name": { $regex: query.search, $options: "i" } }
        ]
      })
    }
    return searchQuery
  }

  private generateAgencyFilter(query: SearchHikesQueryDto, auth_org: string) {
    const searchQuery: Record<string, any>[] = [
      {
        hike_agency: auth_org
      }
    ]
    if (query.search) {
      searchQuery.push({ destination: { $regex: query.search, $options: "i" } })
    }
    return searchQuery
  }

  private readDuration(duration: string) {
    console.log(duration)
    const [min, max] = duration.split("_").map((p) => parseInt(p))
    let res = null
    if (min !== undefined && !Number.isNaN(min)) res = { $gte: min }
    if (max !== undefined && !Number.isNaN(max)) res == null ? (res = { $lte: max }) : (res["$lte"] = max)
    return res
  }
}
