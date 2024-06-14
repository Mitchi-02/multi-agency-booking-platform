import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpStatus } from "@nestjs/common"
import { TravelService } from "./travel.service"
import { CreateTravelDto } from "./dto/create-travel.dto"
import { UpdateTravelDto } from "./dto/update-travel.dto"
import { FormDataRequest } from "nestjs-form-data"
import { BaseController } from "src/utils/base.controller"
import { TravelAgencyService } from "src/travel-agency/travel-agency.service"
import { isValidObjectId } from "mongoose"
import { SearchTravelsQueryDto } from "./dto/search-travels-query.dto"
import { SuggestTravelsQueryDto } from "./dto/suggest-travels-query.dto"

@Controller("travel")
export class TravelController extends BaseController {
  constructor(
    private readonly travelService: TravelService,
    private readonly travelAgencyService: TravelAgencyService
  ) {
    super()
  }

  @Get("/public")
  async findAll(@Query() query: SearchTravelsQueryDto) {
    const { count, results } = await this.travelService.findAll(query)
    return super.sendSuccessResponse("Travels retreived successfully", {
      page_size: query.page_size ?? TravelService.DEFAULT_PAGE_SIZE,
      page: query.page ?? TravelService.DEFAULT_PAGE,
      count,
      results
    })
  }

  @Get("/public/filters")
  async getFilters() {
    return super.sendSuccessResponse("Filters retreived successfully", this.travelService.getFilters())
  }

  @Get("/public/suggest/:agency_id")
  async findByAgency(
    @Param("agency_id") agency_id: string,
    @Query() query: SuggestTravelsQueryDto
  ) {
    if (!isValidObjectId(agency_id)) return super.sendErrorResponse("Agency not found", HttpStatus.NOT_FOUND)
    const res = await this.travelService.suggestByAgency(agency_id, query)
    return super.sendSuccessResponse("Travels found", res)
  }

  @Get("/public/:id")
  async findOne(@Param("id") id: string) {
    if (!isValidObjectId(id)) return super.sendErrorResponse("Travel not found", HttpStatus.NOT_FOUND)
    const res = await this.travelService.findOne(id)
    if (!res) return super.sendErrorResponse("Travel not found", HttpStatus.NOT_FOUND)
    return super.sendSuccessResponse("Travel found", res)
  }

  //Travel Agent Routes
  @Get("/travel_agent")
  async findMine(@Query() query: SearchTravelsQueryDto, @Query("auth_org") auth_org?: string) {
    if (!isValidObjectId(auth_org)) return super.sendErrorResponse("Agency not found", HttpStatus.NOT_FOUND)

    const [results, count] = await Promise.all([
      this.travelService.findMine(query, auth_org),
      this.travelService.countMine(query, auth_org)
    ])
    return super.sendSuccessResponse("Travels retreived successfully", {
      page_size: query.page_size ?? TravelService.DEFAULT_AGENT_PAGE_SIZE,
      page: query.page ?? TravelService.DEFAULT_PAGE,
      count,
      results
    })
  }

  @Get("/travel_agent/:id")
  async findOneMine(@Param("id") id: string, @Query("auth_org") auth_org?: string) {
    if (!isValidObjectId(id) || !isValidObjectId(auth_org))
      return super.sendErrorResponse("Travel not found", HttpStatus.NOT_FOUND)
    const res = await this.travelService.findOne(id)
    if (!res) return super.sendErrorResponse("Travel not found", HttpStatus.NOT_FOUND)
    return super.sendSuccessResponse("Travel found", res)
  }

  @Post("/travel_agent")
  @FormDataRequest()
  async create(@Body() body: CreateTravelDto, @Query("auth_org") id?: string) {
    if (!isValidObjectId(id) || !(await this.travelAgencyService.findOne(id, true)))
      return super.sendErrorResponse("Please complete your agency profile", HttpStatus.NOT_FOUND)

    return super.sendSuccessResponse("Agency created successfully", await this.travelService.create(body, id))
  }

  @Patch("/travel_agent/:id")
  @FormDataRequest()
  async update(
    @Param("id") id: string,
    @Body() upUpdateTravelDto: UpdateTravelDto,
    @Query("auth_org") agency_id?: string
  ) {
    if (!isValidObjectId(id) || !isValidObjectId(agency_id))
      return super.sendErrorResponse("Travel not found", HttpStatus.NOT_FOUND)
    const res = await this.travelService.update(id, upUpdateTravelDto, agency_id)
    if (!res) return super.sendErrorResponse("Travel not found", HttpStatus.NOT_FOUND)
    return super.sendSuccessResponse("Travel updated successfully", res)
  }

  @Delete("/travel_agent/:id")
  async remove(@Param("id") id: string, @Query("auth_org") agency_id?: string) {
    if (!isValidObjectId(id) || !isValidObjectId(agency_id))
      return super.sendErrorResponse("Travel not found", HttpStatus.NOT_FOUND)
    const res = await this.travelService.remove(id, agency_id)
    if (!res) return super.sendErrorResponse("Travel not found", HttpStatus.NOT_FOUND)
    return super.sendSuccessResponse("Travel deleted successfully", res)
  }
}
