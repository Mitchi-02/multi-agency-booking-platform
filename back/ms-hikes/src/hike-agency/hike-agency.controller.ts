import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query } from "@nestjs/common"
import { HikeAgencyService } from "./hike-agency.service"
import { BaseController } from "src/utils/base.controller"
import { isValidObjectId } from "mongoose"
import { CreateHikeAgencyDto } from "./dto/create-hike-agency.dto"
import { UpdateHikeAgencyDto } from "./dto/update-hike-agency.dto"
import { SearchAgenciesQueryDto } from "./dto/search-agencies-query.dto"
import { FormDataRequest } from "nestjs-form-data"

@Controller("agency")
export class HikeAgencyController extends BaseController {
  constructor(private readonly hikeAgencyService: HikeAgencyService) {
    super()
  }

  //Public Routes
  @Get("/public")
  async findAllComplete(@Query() query: SearchAgenciesQueryDto) {
    const [results, count] = await Promise.all([
      this.hikeAgencyService.findAll({
        ...query,
        is_complete: "true"
      }),
      this.hikeAgencyService.countAll({
        is_complete: "true",
        search: query.search
      })
    ])
    return super.sendSuccessResponse("Hike agencies retreived successfully", {
      page_size: query.page_size ?? HikeAgencyService.DEFAULT_PAGE_SIZE,
      page: query.page ?? HikeAgencyService.DEFAULT_PAGE,
      count,
      results
    })
  }

  @Get("/public/:id")
  async findOneComplete(@Param("id") id: string) {
    if (!isValidObjectId(id)) return super.sendErrorResponse("Agency not found", HttpStatus.NOT_FOUND)
    const res = await this.hikeAgencyService.findOne(id, true)
    if (!res) return super.sendErrorResponse("Agency not found", HttpStatus.NOT_FOUND)
    return super.sendSuccessResponse("Agency found", res)
  }

  // Admin Routes
  @Get("/admin")
  async findAll(@Query() query: SearchAgenciesQueryDto) {
    const [results, count] = await Promise.all([
      this.hikeAgencyService.findAll(query),
      this.hikeAgencyService.countAll({
        is_complete: query.is_complete,
        search: query.search
      })
    ])
    return super.sendSuccessResponse("Hike agencies retreived successfully", {
      page_size: query.page_size ?? HikeAgencyService.DEFAULT_PAGE_SIZE,
      page: query.page ?? HikeAgencyService.DEFAULT_PAGE,
      count,
      results
    })
  }

  @Get("/admin/:id")
  async findOne(@Param("id") id: string) {
    if (!isValidObjectId(id)) return super.sendErrorResponse("Agency not found", HttpStatus.NOT_FOUND)
    const res = await this.hikeAgencyService.findOne(id)
    if (!res) return super.sendErrorResponse("Agency not found", HttpStatus.NOT_FOUND)
    return super.sendSuccessResponse("Agency found", res)
  }

  @Post("/admin")
  @FormDataRequest()
  async create(@Body() body: CreateHikeAgencyDto) {
    const res = await this.hikeAgencyService.create(body)
    return super.sendSuccessResponse("Agency created successfully", res)
  }

  @Put("/admin/:id")
  @FormDataRequest()
  async updateRequest(@Param("id") id: string, @Body() body: UpdateHikeAgencyDto) {
    if (!isValidObjectId(id)) return super.sendErrorResponse("Agency not found", HttpStatus.NOT_FOUND)
    const res = await this.hikeAgencyService.update(id, body)
    if (!res) return super.sendErrorResponse("Agency not found", HttpStatus.NOT_FOUND)
    return super.sendSuccessResponse("Agency updated successfully", res)
  }

  @Delete("/admin/:id")
  async remove(@Param("id") id: string) {
    if (!isValidObjectId(id)) return super.sendErrorResponse("Agency not found", HttpStatus.NOT_FOUND)
    const res = await this.hikeAgencyService.remove(id)
    if (!res) return super.sendErrorResponse("Agency not found", HttpStatus.NOT_FOUND)
    return super.sendSuccessResponse("Agency deleted successfully", res)
  }

  //Hike Agent Routes
  @Get("/hike_agent")
  async findOneMine(@Query("auth_org") id?: string) {
    if (!isValidObjectId(id)) return super.sendErrorResponse("Agency not found", HttpStatus.NOT_FOUND)
    const res = await this.hikeAgencyService.findOne(id)
    if (!res) return super.sendErrorResponse("Agency not found", HttpStatus.NOT_FOUND)
    return super.sendSuccessResponse("Agency found", res)
  }

  @Put("/hike_agent")
  @FormDataRequest()
  async updateMine(@Body() body: UpdateHikeAgencyDto, @Query("auth_org") id?: string) {
    if (!isValidObjectId(id)) return super.sendErrorResponse("Agency not found", HttpStatus.NOT_FOUND)
    const res = await this.hikeAgencyService.update(id, body)
    if (!res) return super.sendErrorResponse("Agency not found", HttpStatus.NOT_FOUND)
    return super.sendSuccessResponse("Agency updated successfully", res)
  }

  //Internal Routes
  @Get("/internal/:id")
  async checkOne(@Param("id") id: string) {
    if (!isValidObjectId(id)) return super.sendErrorResponse("Agency not found", HttpStatus.NOT_FOUND)
    const res = await this.hikeAgencyService.findOne(id)
    if (!res) return super.sendErrorResponse("Agency not found", HttpStatus.NOT_FOUND)
    return res
  }
}
