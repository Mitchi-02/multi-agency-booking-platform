import { Injectable } from "@nestjs/common"
import { CreateTravelDto } from "./dto/create-travel.dto"
import { UpdateTravelDto } from "./dto/update-travel.dto"
import { Travel } from "src/schemas/Travel.schema"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { StorageService } from "src/storage/storage.service"
import { SearchTravelsQueryDto } from "./dto/search-travels-query.dto"
import { TravelAgency } from "src/schemas/TravelAgency.schema"
import { SuggestTravelsQueryDto } from "./dto/suggest-travels-query.dto"
import { QueryCacheService } from "src/query-cache/query-cache.service"
import { KafkaService } from "src/kafka/kafka.service"
import { TravelDeletedEvent } from "src/kafka/core/travels/events"

type PaginatedTravels = {
  count: number
  results: Travel[]
}

@Injectable()
export class TravelService {
  static readonly DEFAULT_PAGE_SIZE = 6
  static readonly DEFAULT_SUGGEST_PAGE_SIZE = 3
  static readonly DEFAULT_AGENT_PAGE_SIZE = 10
  static readonly DEFAULT_PAGE = 1
  static readonly IMAGES_PATH = "travels/"

  constructor(
    @InjectModel(Travel.name) private travelModel: Model<Travel>,
    private readonly storageService: StorageService,
    private readonly queryCacheService: QueryCacheService,
    private readonly kafkaService: KafkaService
  ) {}

  getFilters() {
    return {
      complementary_services_types: Travel.COMPLEMENTARY_SERVICES_TYPES.map((t, index) => ({ id: index, name: t })),
      travel_experiences: Travel.TRAVEL_EXPERIENCES.map((t, index) => ({ id: index, name: t })),
      regions: Travel.REGIONS.map((t, index) => ({ id: index, name: t })),
      transportation_types: Travel.TRANSPORTATION_TYPES.map((t, index) => ({ id: index, name: t }))
    }
  }

  findAll(query: SearchTravelsQueryDto) {
    const searchQuery = this.generateClientFilter(query)
    const page = (query.page ?? TravelService.DEFAULT_PAGE) - 1
    const page_size = query.page_size ?? TravelService.DEFAULT_PAGE_SIZE
    return this.queryCacheService
      .get<PaginatedTravels[]>({
        key: "TRAVELS_CLIENT",
        promise: this.travelModel.aggregate<PaginatedTravels>([
          {
            $facet: {
              results: [
                {
                  $project: {
                    title: 1,
                    description: 1,
                    hotel: 1,
                    departure_date: 1,
                    return_date: 1,
                    departure_place: 1,
                    destination: 1,
                    adult_price: 1,
                    kid_price: 1,
                    transportation_type: 1,
                    region: 1,
                    experiences: 1,
                    places_left: 1,
                    //keep first photo in the array
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
                    travel_agency: 1
                  }
                },
                {
                  $lookup: {
                    from: "travel_agencies",
                    localField: "travel_agency",
                    foreignField: "_id",
                    as: "travel_agency",
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
                { $unwind: "$travel_agency" },
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
      return this.queryCacheService.get<Travel>({
        key: "TRAVEL_BY_AGENCY",
        value: `${id}_${agency_id}`,
        promise: this.travelModel.findOne({ _id: id, travel_agency: agency_id })
      })
    return this.queryCacheService.get<Travel>({
      key: "TRAVEL_CLIENT",
      value: id,
      promise: this.travelModel.findById(id).populate<{ travel_agency: TravelAgency }>({
        path: "travel_agency",
        select: "name _id rating address logo photos reviews_count"
      })
    })
  }

  suggestByAgency(agency_id: string, query: SuggestTravelsQueryDto) {
    const filter = {
      travel_agency: agency_id,
      places_left: {
        $ne: 0
      }
    }
    const page_size = query.page_size ?? TravelService.DEFAULT_SUGGEST_PAGE_SIZE
    if (query.exclude) filter["_id"] = { $ne: query.exclude }
    return this.queryCacheService.get<Travel[]>({
      key: "TRAVELS_SUGGEST",
      promise: this.travelModel
        .find(filter, {
          title: 1,
          travel_agency: 1,
          destination: 1,
          photos: 1
        })
        .populate<{ travel_agency: TravelAgency }>({
          path: "travel_agency",
          select: "_id rating reviews_count"
        })
        .sort({ departure_date: 1 })
        .limit(page_size),
      value: `${page_size}_${agency_id}_${query.exclude ?? "ALL"}`
    })
  }

  countMine(query: SearchTravelsQueryDto, auth_org: string) {
    const searchQuery = this.generateAgencyFilter(query, auth_org)
    return this.queryCacheService.get<number>({
      key: "TRAVELS_COUNT_BY_AGENCY",
      promise: this.travelModel.countDocuments({
        $and: searchQuery
      }),
      value: JSON.stringify(searchQuery)
    })
  }

  //Travel Agent Routes
  findMine(query: SearchTravelsQueryDto, auth_org: string) {
    const searchQuery = this.generateAgencyFilter(query, auth_org)
    const page = (query.page ?? TravelService.DEFAULT_PAGE) - 1
    const page_size = query.page_size ?? TravelService.DEFAULT_AGENT_PAGE_SIZE
    return this.queryCacheService.get<Travel[]>({
      key: "TRAVELS_BY_AGENCY",
      promise: this.travelModel.find(
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
          travel_agency: 1
        },
        {
          skip: page_size * page,
          sort: { createdAt: -1 },
          limit: page_size
        }
      ),
      value: `${page}_${query.page_size ?? TravelService.DEFAULT_PAGE_SIZE}_${JSON.stringify(searchQuery)}`
    })
  }

  create(data: CreateTravelDto, agency_id: string) {
    const d = {}
    const fields = [
      "title",
      "description",
      "hotel",
      "departure_date",
      "return_date",
      "departure_place",
      "destination",
      "total_limit",
      "adult_price",
      "kid_price",
      "region",
      "transportation_type",
    ]
    fields.forEach((key) => {
      d[key] = data[key]
    })
    if (data.photos) d["photos"] = this.storageService.saveMany(TravelService.IMAGES_PATH, ...data.photos)
    return this.queryCacheService.invalidate({
      couples: [
        { key: "TRAVELS_CLIENT", all: true },
        { key: "TRAVELS_SUGGEST", all: true },
        { key: "TRAVELS_BY_AGENCY", all: true },
        { key: "TRAVELS_COUNT_BY_AGENCY", all: true }
      ],
      promise: this.travelModel.create({
        ...d,
        plan: data.plan?.map((p) => JSON.parse(p)),
        places_left: data.total_limit,
        complementary_services: data.complementary_services?.map((p) => JSON.parse(p)),
        //duration in days
        duration: Math.ceil(
          (new Date(data.return_date).getTime() - new Date(data.departure_date).getTime()) / (1000 * 60 * 60 * 24)
        ),
        travel_agency: agency_id,
        experiences: [...new Set(data.experiences ?? [])]
      })
    })
  }

  async remove(id: string, agency_id: string) {
    const res = await this.queryCacheService.invalidate({
      couples: [
        { key: "TRAVEL_CLIENT", value: id },
        { key: "TRAVEL_BY_AGENCY", value: `${id}_${agency_id}` },
        { key: "TRAVELS_CLIENT", all: true },
        { key: "TRAVELS_SUGGEST", all: true },
        { key: "TRAVELS_BY_AGENCY", all: true },
        { key: "TRAVELS_COUNT_BY_AGENCY", all: true },
        { key: "BOOKING", all: true },
        { key: "BOOKINGS", all: true }
      ],
      promise: this.travelModel.findByIdAndDelete(id)
    })
    if (res) this.kafkaService.sendTravelEvent(new TravelDeletedEvent({ id }))
    return res
  }

  async update(id: string, data: UpdateTravelDto, agency_id: string) {
    const agency = await this.travelModel.findOne({ _id: id, travel_agency: agency_id })
    if (!agency) return null
    const fields = [
      "title",
      "description",
      "hotel",
      "departure_date",
      "return_date",
      "departure_place",
      "destination",
      "total_limit",
      "adult_price",
      "kid_price",
      "places_left",
      "region",
      "transportation_type"
    ]
    fields.forEach((key) => {
      if (data[key]) agency[key] = data[key]
    })
    if (data.plan) agency.plan = data.plan.map((p) => JSON.parse(p))
    if (data.complementary_services)
      agency.complementary_services = data.complementary_services.map((p) => JSON.parse(p))
    if (data.experiences) agency.experiences = [...new Set(data.experiences)]

    agency["photos"] = agency.photos
      .filter((p) => {
        if (data.deleted_photos?.find((f) => f.includes(p))) {
          this.storageService.delete(p)
          return false
        }
        return true
      })
      .concat(this.storageService.saveMany(TravelService.IMAGES_PATH, ...(data.new_photos ?? [])))

    await this.queryCacheService.invalidate({
      couples: [
        { key: "TRAVEL_CLIENT", value: id },
        { key: "TRAVEL_BY_AGENCY", value: `${id}_${agency_id}` },
        { key: "TRAVELS_CLIENT", all: true },
        { key: "TRAVELS_SUGGEST", all: true },
        { key: "TRAVELS_BY_AGENCY", all: true },
        { key: "TRAVELS_COUNT_BY_AGENCY", all: true },
        { key: "BOOKING", all: true },
        { key: "BOOKINGS", all: true }
      ],
      promise: agency.save()
    })
    return agency
  }

  //utils
  private generateClientFilter(query: SearchTravelsQueryDto) {
    const searchQuery = []
    if (query.title) searchQuery.push({ title: { $regex: query.title, $options: "i" } })
    if (query.destination) searchQuery.push({ destination: { $regex: query.destination, $options: "i" } })

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

    if (query.durations !== undefined) {
      const duration = query.durations
        .split("-")
        .map((d) => this.readDuration(d))
        .filter((d) => d !== null)
      if (duration.length > 0) searchQuery.push({ $or: duration.map((d) => ({ duration: d })) })
    }

    if (query.travel_experiences)
      searchQuery.push({ experiences: { $in: query.travel_experiences.split("_").filter((e) => e !== "") } })
    if (query.regions) searchQuery.push({ region: { $in: query.regions.split("_").filter((e) => e !== "") } })
    if (query.transportation_types)
      searchQuery.push({ transportation_type: { $in: query.transportation_types.split("_").filter((e) => e !== "") } })

    if (query.search) {
      searchQuery.push({
        $or: [
          { departure_place: { $regex: query.search, $options: "i" } },
          { "travel_agency.name": { $regex: query.search, $options: "i" } }
        ]
      })
    }
    return searchQuery
  }

  private generateAgencyFilter(query: SearchTravelsQueryDto, auth_org: string) {
    const searchQuery: Record<string, any>[] = [
      {
        travel_agency: auth_org
      }
    ]
    if (query.search) {
      searchQuery.push({ destination: { $regex: query.search, $options: "i" } })
    }
    return searchQuery
  }

  private readDuration(duration: string) {
    const [min, max] = duration.split("_").map((p) => parseInt(p))
    let res = null
    if (min !== undefined && !Number.isNaN(min)) res = { $gte: min }
    if (max !== undefined && !Number.isNaN(max)) res == null ? (res = { $lte: max }) : (res["$lte"] = max)
    return res
  }
}
