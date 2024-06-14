import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Query } from "@nestjs/common"
import { AgencyRequestService } from "./agency-request.service"
import { CreateAgencyRequestDto } from "./dto/create-agency-request.dto"
import { UpdateAgencyRequestDto } from "./dto/update-agency-request.dto"
import { isValidObjectId } from "mongoose"
import { BaseController } from "src/utils/base.controller"
import { SearchRequestsQueryDto } from "./dto/search-requests-query.dto"

@Controller("request")
export class AgencyRequestController extends BaseController {
  constructor(private readonly agencyRequestService: AgencyRequestService) {
    super()
  }

  @Post("/public")
  async create(@Body() body: CreateAgencyRequestDto) {
    const res = await this.agencyRequestService.create(body.email)
    if (res) return super.sendSuccessResponse("Request created successfully")
    return super.sendErrorResponse("Request already exists with this email", HttpStatus.BAD_REQUEST)
  }

  // Admin Routes

  @Get()
  async findAll(@Query() query: SearchRequestsQueryDto) {
    const [results, count] = await Promise.all([
      this.agencyRequestService.findAll(query),
      this.agencyRequestService.countAll()
    ])
    return super.sendSuccessResponse("Requests retreived successfully", {
      page_size: query.page_size ?? AgencyRequestService.DEFAULT_PAGE_SIZE,
      page: query.page ?? AgencyRequestService.DEFAULT_PAGE,
      count,
      results
    })
  }

  @Get("/:id")
  async findOne(@Param("id") id: string) {
    if (!isValidObjectId(id)) return super.sendErrorResponse("Request not found", HttpStatus.NOT_FOUND)
    const res = await this.agencyRequestService.findOne(id)
    if (!res) return super.sendErrorResponse("Request not found", HttpStatus.NOT_FOUND)
    return super.sendSuccessResponse("Request found", res)
  }

  @Patch("/:id")
  async updateRequest(@Param("id") id: string, @Body() body: UpdateAgencyRequestDto) {
    if (!isValidObjectId(id)) return super.sendErrorResponse("Request not found", HttpStatus.NOT_FOUND)
    const res = await this.agencyRequestService.update(id, body.status)
    if (!res) return super.sendErrorResponse("Request not found", HttpStatus.NOT_FOUND)
    return super.sendSuccessResponse("Request updated successfully", res)
  }

  @Delete("/:id")
  async remove(@Param("id") id: string) {
    if (!isValidObjectId(id)) return super.sendErrorResponse("Request not found", HttpStatus.NOT_FOUND)
    const res = await this.agencyRequestService.remove(id)
    if (!res) return super.sendErrorResponse("Request not found", HttpStatus.NOT_FOUND)
    return super.sendSuccessResponse("Request deleted successfully", res)
  }
}
