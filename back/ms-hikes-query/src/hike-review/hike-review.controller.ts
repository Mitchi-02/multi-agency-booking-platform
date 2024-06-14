import { Controller, Get, HttpStatus, Param, Query } from "@nestjs/common"
import { isValidObjectId } from "mongoose"
import { HikeReviewService } from "./hike-review.service"
import { BaseController } from "src/utils/base.controller"
import { PaginationQueryDto } from "src/utils/dto/pagination-query.dto"

@Controller("reviews")
export class HikeReviewController extends BaseController {
  constructor(private readonly hikeReviewService: HikeReviewService) {
    super()
  }

  //public
  @Get("/public/top-three/:agency_id")
  async findThreeHighestRated(@Param("agency_id") agency_id: string) {
    if (!isValidObjectId(agency_id)) return super.sendErrorResponse("Agency not found", HttpStatus.NOT_FOUND)
    const reviews = await this.hikeReviewService.findThreeHighestRated(agency_id)
    return super.sendSuccessResponse("Top three reviews fetched successfully", reviews)
  }

  // agent
  @Get("/agent")
  async findAll(@Query() query: PaginationQueryDto, @Query("auth_org") agency_id: string) {
    if (!isValidObjectId(agency_id)) return super.sendErrorResponse("Agency not found", HttpStatus.NOT_FOUND)
    const [results, count] = await Promise.all([
      this.hikeReviewService.findAll(query, agency_id),
      this.hikeReviewService.countAll(agency_id)
    ])
    return super.sendSuccessResponse("Reviews retreived successfully", {
      page_size: query.page_size ?? HikeReviewService.DEFAULT_PAGE_SIZE,
      page: query.page ?? HikeReviewService.DEFAULT_PAGE,
      count,
      results
    })
  }

  @Get("/agent/hike/:hike_id")
  async findByHike(
    @Query() query: PaginationQueryDto,
    @Query("auth_org") agency_id: string,
    @Param("hike_id") hike_id: string
  ) {
    if (!isValidObjectId(agency_id) || !isValidObjectId(hike_id))
      return super.sendErrorResponse("Agency or hike not found", HttpStatus.NOT_FOUND)
    const [results, count] = await Promise.all([
      this.hikeReviewService.findAll(query, agency_id, hike_id),
      this.hikeReviewService.countAll(agency_id, hike_id)
    ])
    return super.sendSuccessResponse("Reviews retreived successfully", {
      page_size: query.page_size ?? HikeReviewService.DEFAULT_PAGE_SIZE,
      page: query.page ?? HikeReviewService.DEFAULT_PAGE,
      count,
      results
    })
  }

  @Get("/agent/:booking_id")
  async getOneAgent(@Query("auth_org") agency_id: string, @Param("booking_id") booking_id: string) {
    if (!isValidObjectId(booking_id)) return super.sendErrorResponse("Booking not found", HttpStatus.NOT_FOUND)
    const review = await this.hikeReviewService.findOne({
      booking: booking_id,
      agency_id
    })
    if (!review) return super.sendErrorResponse("Review not found", HttpStatus.NOT_FOUND)
    return super.sendSuccessResponse("Review created successfully", review)
  }
}
