import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query } from "@nestjs/common"
import { TravelAgencyService } from "./travel-agency.service"
import { BaseController } from "src/utils/base.controller"
import { isValidObjectId } from "mongoose"
import { CreateTravelAgencyDto } from "./dto/create-travel-agency.dto"
import { UpdateTravelAgencyDto } from "./dto/update-travel-agency.dto"
import { SearchAgenciesQueryDto } from "./dto/search-agencies-query.dto"
import { FormDataRequest } from "nestjs-form-data"

@Controller("agency")
export class TravelAgencyController extends BaseController {
  constructor(private readonly travelAgencyService: TravelAgencyService) {
    super()
  }

  //Public Routes
  @Get("/public")
  async findAllComplete(@Query() query: SearchAgenciesQueryDto) {
    const [results, count] = await Promise.all([
      this.travelAgencyService.findAll({
        ...query,
        is_complete: "true"
      }),
      this.travelAgencyService.countAll({
        is_complete: "true",
        search: query.search
      })
    ])
    return super.sendSuccessResponse("Travel agencies retreived successfully", {
      page_size: query.page_size ?? TravelAgencyService.DEFAULT_PAGE_SIZE,
      page: query.page ?? TravelAgencyService.DEFAULT_PAGE,
      count,
      results
    })
  }

  @Get("/public/:id")
  async findOneComplete(@Param("id") id: string) {
    if (!isValidObjectId(id)) return super.sendErrorResponse("Agency not found", HttpStatus.NOT_FOUND)
    const res = await this.travelAgencyService.findOne(id, true)
    if (!res) return super.sendErrorResponse("Agency not found", HttpStatus.NOT_FOUND)
    return super.sendSuccessResponse("Agency found", res)
  }

  // Admin Routes
  @Get("/admin")
  async findAll(@Query() query: SearchAgenciesQueryDto) {
    const [results, count] = await Promise.all([
      this.travelAgencyService.findAll(query),
      this.travelAgencyService.countAll({
        is_complete: query.is_complete,
        search: query.search
      })
    ])
    return super.sendSuccessResponse("Travel agencies retreived successfully", {
      page_size: query.page_size ?? TravelAgencyService.DEFAULT_PAGE_SIZE,
      page: query.page ?? TravelAgencyService.DEFAULT_PAGE,
      count,
      results
    })
  }

  @Get("/admin/:id")
  async findOne(@Param("id") id: string) {
    if (!isValidObjectId(id)) return super.sendErrorResponse("Agency not found", HttpStatus.NOT_FOUND)
    const res = await this.travelAgencyService.findOne(id)
    if (!res) return super.sendErrorResponse("Agency not found", HttpStatus.NOT_FOUND)
    return super.sendSuccessResponse("Agency found", res)
  }

  @Post("/admin")
  @FormDataRequest()
  async create(@Body() body: CreateTravelAgencyDto) {
    const res = await this.travelAgencyService.create(body)
    return super.sendSuccessResponse("Agency created successfully", res)
  }

  @Put("/admin/:id")
  @FormDataRequest()
  async updateRequest(@Param("id") id: string, @Body() body: UpdateTravelAgencyDto) {
    if (!isValidObjectId(id)) return super.sendErrorResponse("Agency not found", HttpStatus.NOT_FOUND)
    const res = await this.travelAgencyService.update(id, body)
    if (!res) return super.sendErrorResponse("Agency not found", HttpStatus.NOT_FOUND)
    return super.sendSuccessResponse("Agency updated successfully", res)
  }

  @Delete("/admin/:id")
  async remove(@Param("id") id: string) {
    if (!isValidObjectId(id)) return super.sendErrorResponse("Agency not found", HttpStatus.NOT_FOUND)
    const res = await this.travelAgencyService.remove(id)
    if (!res) return super.sendErrorResponse("Agency not found", HttpStatus.NOT_FOUND)
    return super.sendSuccessResponse("Agency deleted successfully", res)
  }

  //Travel Agent Routes
  @Get("/travel_agent")
  async findOneMine(@Query("auth_org") id?: string) {
    if (!isValidObjectId(id)) return super.sendErrorResponse("Agency not found", HttpStatus.NOT_FOUND)
    const res = await this.travelAgencyService.findOne(id)
    if (!res) return super.sendErrorResponse("Agency not found", HttpStatus.NOT_FOUND)
    return super.sendSuccessResponse("Agency found", res)
  }

  @Put("/travel_agent")
  @FormDataRequest()
  async updateMine(@Body() body: UpdateTravelAgencyDto, @Query("auth_org") id?: string) {
    if (!isValidObjectId(id)) return super.sendErrorResponse("Agency not found", HttpStatus.NOT_FOUND)
    const res = await this.travelAgencyService.update(id, body)
    if (!res) return super.sendErrorResponse("Agency not found", HttpStatus.NOT_FOUND)
    return super.sendSuccessResponse("Agency updated successfully", res)
  }

  //Internal Routes
  @Get("/internal/:id")
  async checkOne(@Param("id") id: string) {
    if (!isValidObjectId(id)) return super.sendErrorResponse("Agency not found", HttpStatus.NOT_FOUND)
    const res = await this.travelAgencyService.findOne(id)
    if (!res) return super.sendErrorResponse("Agency not found", HttpStatus.NOT_FOUND)
    return res
  }
}
