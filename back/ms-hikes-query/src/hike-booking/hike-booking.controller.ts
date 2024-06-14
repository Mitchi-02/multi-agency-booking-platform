import { Controller, Get, HttpStatus, Param, Query } from "@nestjs/common"
import { HikeBookingService } from "./hike-booking.service"
import { isValidObjectId } from "mongoose"
import { BaseController } from "src/utils/base.controller"
import { PaginationQueryDto } from "src/utils/dto/pagination-query.dto"

@Controller("booking")
export class HikeBookingController extends BaseController {
  constructor(private readonly hikeBookingService: HikeBookingService) {
    super()
  }

  @Get("/agent")
  async findByAgency(@Query() query: PaginationQueryDto, @Query("auth_org") agency_id?: string) {
    if (!isValidObjectId(agency_id))
      return super.sendErrorResponse("Please complete your agency profile", HttpStatus.NOT_FOUND)
    const { count, results, page, page_size } = await this.hikeBookingService.findAll(query, {
      agency_id
    })
    return super.sendSuccessResponse("Hike bookings retrieved successfully", {
      page,
      page_size,
      count,
      results
    })
  }

  @Get("/agent/hike/:hike_id")
  async findByHike(
    @Param("hike_id") hike_id: string,
    @Query() query: PaginationQueryDto,
    @Query("auth_org") agency_id?: string
  ) {
    if (!isValidObjectId(hike_id) || !isValidObjectId(agency_id))
      return super.sendErrorResponse("Hike not found", HttpStatus.NOT_FOUND)

    const { count, results, page, page_size } = await this.hikeBookingService.findAll(query, {
      agency_id,
      hike_id
    })
    return super.sendSuccessResponse("Hike bookings retrieved successfully", {
      page,
      page_size,
      count,
      results
    })
  }

  @Get("/agent/:id")
  async findOneAgency(@Param("id") id: string, @Query("auth_org") agency_id?: string) {
    if (!isValidObjectId(id) || !isValidObjectId(agency_id))
      return super.sendErrorResponse("Booking not found", HttpStatus.NOT_FOUND)
    const booking = await this.hikeBookingService.findOne({
      booking_id: id,
      agency_id
    })
    if (!booking) return super.sendErrorResponse("Booking not found", HttpStatus.NOT_FOUND)
    return super.sendSuccessResponse("Booking found", booking)
  }
}
