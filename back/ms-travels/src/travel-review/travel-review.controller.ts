import { Body, Controller, Get, HttpStatus, Param, Post, Query } from "@nestjs/common"
import { isValidObjectId } from "mongoose"
import { TravelService } from "src/travel/travel.service"
import { TravelBookingService } from "src/travel-booking/travel-booking.service"
import { TravelReviewService } from "./travel-review.service"
import { BaseController } from "src/utils/base.controller"
import { CreateTravelReviewDto } from "./dto/create-review.dto"

@Controller("reviews")
export class TravelReviewController extends BaseController {
  constructor(
    private readonly travelService: TravelService,
    private readonly travelBookingService: TravelBookingService,
    private readonly travelReviewService: TravelReviewService
  ) {
    super()
  }

  // auth
  @Post("/auth")
  async create(@Query("auth_id") user_id: number, @Body() createTravelReviewDto: CreateTravelReviewDto) {
    const booking = await this.travelBookingService.findOne({
      booking_id: createTravelReviewDto.booking_id,
      user_id
    })
    if (!booking) return super.sendErrorResponse("You have not booked this travel", HttpStatus.FORBIDDEN)
    const review = await this.travelReviewService.findOne({
      booking: createTravelReviewDto.booking_id,
      user_id
    })
    if (review) return super.sendErrorResponse("Review already exists", HttpStatus.BAD_REQUEST)
    const travel = await this.travelService.findOne(booking.travel._id)
    const travelReview = await this.travelReviewService.create(
      user_id,
      createTravelReviewDto,
      booking.travel_agency._id,
      travel._id
    )
    return super.sendSuccessResponse("Review created successfully", travelReview)
  }

  @Get("/auth/:booking_id")
  async getOne(@Query("auth_id") user_id: number, @Param("booking_id") booking_id: string) {
    if (!isValidObjectId(booking_id)) return super.sendErrorResponse("Booking not found", HttpStatus.NOT_FOUND)
    const review = await this.travelReviewService.findOne({
      booking: booking_id,
      user_id
    })
    if (!review) return super.sendErrorResponse("Review not found", HttpStatus.NOT_FOUND)
    return super.sendSuccessResponse("Review created successfully", review)
  }
}
