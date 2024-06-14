import { Controller, Get, HttpStatus, Param, Query } from "@nestjs/common"
import { isValidObjectId } from "mongoose"
import { TravelReviewService } from "./travel-review.service"
import { BaseController } from "src/utils/base.controller"
import { PaginationQueryDto } from "src/utils/dto/pagination-query.dto"

@Controller("reviews")
export class TravelReviewController extends BaseController {
  constructor(private readonly travelReviewService: TravelReviewService) {
    super()
  }

  //public
  @Get("/public/top-three/:agency_id")
  async findThreeHighestRated(@Param("agency_id") agency_id: string) {
    if (!isValidObjectId(agency_id)) return super.sendErrorResponse("Agency not found", HttpStatus.NOT_FOUND)
    const reviews = await this.travelReviewService.findThreeHighestRated(agency_id)
    return super.sendSuccessResponse("Top three reviews fetched successfully", reviews)
  }

  // agent
  @Get("/agent")
  async findAll(@Query() query: PaginationQueryDto, @Query("auth_org") agency_id: string) {
    if (!isValidObjectId(agency_id)) return super.sendErrorResponse("Agency not found", HttpStatus.NOT_FOUND)
    const [results, count] = await Promise.all([
      this.travelReviewService.findAll(query, agency_id),
      this.travelReviewService.countAll(agency_id)
    ])
    return super.sendSuccessResponse("Reviews retreived successfully", {
      page_size: query.page_size ?? TravelReviewService.DEFAULT_PAGE_SIZE,
      page: query.page ?? TravelReviewService.DEFAULT_PAGE,
      count,
      results
    })
  }

  @Get("/agent/travel/:travel_id")
  async findByTravel(
    @Query() query: PaginationQueryDto,
    @Query("auth_org") agency_id: string,
    @Param("travel_id") travel_id: string
  ) {
    if (!isValidObjectId(agency_id) || !isValidObjectId(travel_id))
      return super.sendErrorResponse("Agency or travel not found", HttpStatus.NOT_FOUND)
    const [results, count] = await Promise.all([
      this.travelReviewService.findAll(query, agency_id, travel_id),
      this.travelReviewService.countAll(agency_id, travel_id)
    ])
    return super.sendSuccessResponse("Reviews retreived successfully", {
      page_size: query.page_size ?? TravelReviewService.DEFAULT_PAGE_SIZE,
      page: query.page ?? TravelReviewService.DEFAULT_PAGE,
      count,
      results
    })
  }

  @Get("/agent/:booking_id")
  async getOneAgent(@Query("auth_org") agency_id: string, @Param("booking_id") booking_id: string) {
    if (!isValidObjectId(booking_id)) return super.sendErrorResponse("Booking not found", HttpStatus.NOT_FOUND)
    const review = await this.travelReviewService.findOne({
      booking: booking_id,
      agency_id
    })
    if (!review) return super.sendErrorResponse("Review not found", HttpStatus.NOT_FOUND)
    return super.sendSuccessResponse("Review created successfully", review)
  }
}
