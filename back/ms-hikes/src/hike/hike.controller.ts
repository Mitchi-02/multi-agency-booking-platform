import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpStatus } from "@nestjs/common"
import { HikeService } from "./hike.service"
import { CreateHikeDto } from "./dto/create-hike.dto"
import { UpdateHikeDto } from "./dto/update-hike.dto"
import { FormDataRequest } from "nestjs-form-data"
import { BaseController } from "src/utils/base.controller"
import { HikeAgencyService } from "src/hike-agency/hike-agency.service"
import { isValidObjectId } from "mongoose"
import { SearchHikesQueryDto } from "./dto/search-hikes-query.dto"
import { SuggestHikesQueryDto } from "./dto/suggest-travels-query.dto"

@Controller("hike")
export class HikeController extends BaseController {
  constructor(
    private readonly hikeService: HikeService,
    private readonly hikeAgencyService: HikeAgencyService
  ) {
    super()
  }

  @Get("/public")
  async findAll(@Query() query: SearchHikesQueryDto, @Query("auth_org") id?: string) {
    const { count, results } = await this.hikeService.findAll(query)
    return super.sendSuccessResponse("Hikes retreived successfully", {
      page_size: query.page_size ?? HikeService.DEFAULT_PAGE_SIZE,
      page: query.page ?? HikeService.DEFAULT_PAGE,
      count,
      results
    })
  }

  @Get("/public/filters")
  async getFilters() {
    return super.sendSuccessResponse("Filters retreived successfully", this.hikeService.getFilters())
  }

  @Get("/public/suggest/:agency_id")
  async findByAgency(@Param("agency_id") agency_id: string, @Query() query: SuggestHikesQueryDto) {
    if (!isValidObjectId(agency_id)) return super.sendErrorResponse("Agency not found", HttpStatus.NOT_FOUND)
    const res = await this.hikeService.suggestByAgency(agency_id, query)
    return super.sendSuccessResponse("Hikes found", res)
  }

  @Get("/public/:id")
  async findOne(@Param("id") id: string) {
    if (!isValidObjectId(id)) return super.sendErrorResponse("Hike not found", HttpStatus.NOT_FOUND)
    const res = await this.hikeService.findOne(id)
    if (!res) return super.sendErrorResponse("Hike not found", HttpStatus.NOT_FOUND)
    return super.sendSuccessResponse("Hike found", res)
  }

  //Hike Agent Routes
  @Get("/hike_agent")
  async findMine(@Query() query: SearchHikesQueryDto, @Query("auth_org") auth_org?: string) {
    if (!isValidObjectId(auth_org)) return super.sendErrorResponse("Agency not found", HttpStatus.NOT_FOUND)

    const [results, count] = await Promise.all([
      this.hikeService.findMine(query, auth_org),
      this.hikeService.countMine(query, auth_org)
    ])
    return super.sendSuccessResponse("Hikes retreived successfully", {
      page_size: query.page_size ?? HikeService.DEFAULT_AGENT_PAGE_SIZE,
      page: query.page ?? HikeService.DEFAULT_PAGE,
      count,
      results
    })
  }

  @Get("/hike_agent/:id")
  async findOneMine(@Param("id") id: string, @Query("auth_org") auth_org?: string) {
    if (!isValidObjectId(id) || !isValidObjectId(auth_org))
      return super.sendErrorResponse("Hike not found", HttpStatus.NOT_FOUND)
    const res = await this.hikeService.findOne(id)
    if (!res) return super.sendErrorResponse("Hike not found", HttpStatus.NOT_FOUND)
    return super.sendSuccessResponse("Hike found", res)
  }

  @Post("/hike_agent")
  @FormDataRequest()
  async create(@Body() body: CreateHikeDto, @Query("auth_org") id?: string) {
    if (!isValidObjectId(id) || !(await this.hikeAgencyService.findOne(id, true)))
      return super.sendErrorResponse("Please complete your agency profile", HttpStatus.NOT_FOUND)

    return super.sendSuccessResponse("Agency created successfully", await this.hikeService.create(body, id))
  }

  @Patch("/hike_agent/:id")
  @FormDataRequest()
  async update(@Param("id") id: string, @Body() updateHikeDto: UpdateHikeDto, @Query("auth_org") agency_id?: string) {
    if (!isValidObjectId(id) || !isValidObjectId(agency_id))
      return super.sendErrorResponse("Hike not found", HttpStatus.NOT_FOUND)
    const res = await this.hikeService.update(id, updateHikeDto, agency_id)
    if (!res) return super.sendErrorResponse("Hike not found", HttpStatus.NOT_FOUND)
    return super.sendSuccessResponse("Hike updated successfully", res)
  }

  @Delete("/hike_agent/:id")
  async remove(@Param("id") id: string, @Query("auth_org") agency_id?: string) {
    if (!isValidObjectId(id) || !isValidObjectId(agency_id))
      return super.sendErrorResponse("Hike not found", HttpStatus.NOT_FOUND)
    const res = await this.hikeService.remove(id, agency_id)
    if (!res) return super.sendErrorResponse("Hike not found", HttpStatus.NOT_FOUND)
    return super.sendSuccessResponse("Hike deleted successfully", res)
  }
}
