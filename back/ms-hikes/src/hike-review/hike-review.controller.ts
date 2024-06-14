import { Body, Controller, Get, HttpStatus, Param, Post, Query } from "@nestjs/common"
import { isValidObjectId } from "mongoose"
import { HikeService } from "src/hike/hike.service"
import { HikeBookingService } from "src/hike-booking/hike-booking.service"
import { HikeReviewService } from "./hike-review.service"
import { BaseController } from "src/utils/base.controller"
import { CreateHikeReviewDto } from "./dto/create-review.dto"

@Controller("reviews")
export class HikeReviewController extends BaseController {
  constructor(
    private readonly hikeService: HikeService,
    private readonly hikeBookingService: HikeBookingService,
    private readonly hikeHikeReviewService: HikeReviewService
  ) {
    super()
  }

  // auth
  @Post("/auth")
  async create(@Query("auth_id") user_id: number, @Body() createHikeReviewDto: CreateHikeReviewDto) {
    const booking = await this.hikeBookingService.findOne({
      booking_id: createHikeReviewDto.booking_id,
      user_id
    })
    if (!booking) return super.sendErrorResponse("You have not booked this hike", HttpStatus.FORBIDDEN)
    const review = await this.hikeHikeReviewService.findOne({
      booking: createHikeReviewDto.booking_id,
      user_id
    })
    if (review) return super.sendErrorResponse("Review already exists", HttpStatus.BAD_REQUEST)
    const hike = await this.hikeService.findOne(booking.hike._id)
    const hikeReview = await this.hikeHikeReviewService.create(
      user_id,
      createHikeReviewDto,
      booking.hike_agency._id,
      hike._id
    )
    return super.sendSuccessResponse("Review created successfully", hikeReview)
  }

  @Get("/auth/:booking_id")
  async getOne(@Query("auth_id") user_id: number, @Param("booking_id") booking_id: string) {
    if (!isValidObjectId(booking_id)) return super.sendErrorResponse("Booking not found", HttpStatus.NOT_FOUND)
    const review = await this.hikeHikeReviewService.findOne({
      booking: booking_id,
      user_id
    })
    if (!review) return super.sendErrorResponse("Review not found", HttpStatus.NOT_FOUND)
    return super.sendSuccessResponse("Review created successfully", review)
  }
}
