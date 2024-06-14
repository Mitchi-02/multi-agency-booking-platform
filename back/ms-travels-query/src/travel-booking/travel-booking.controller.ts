import { Controller, Get, HttpStatus, Param, Query } from "@nestjs/common"
import { TravelBookingService } from "./travel-booking.service"
import { isValidObjectId } from "mongoose"
import { BaseController } from "src/utils/base.controller"
import { PaginationQueryDto } from "src/utils/dto/pagination-query.dto"

@Controller("booking")
export class TravelBookingController extends BaseController {
  constructor(private readonly travelBookingService: TravelBookingService) {
    super()
  }

  @Get("/agent")
  async findByAgency(@Query() query: PaginationQueryDto, @Query("auth_org") agency_id?: string) {
    if (!isValidObjectId(agency_id))
      return super.sendErrorResponse("Please complete your agency profile", HttpStatus.NOT_FOUND)
    const { count, results, page, page_size } = await this.travelBookingService.findAll(query, {
      agency_id
    })
    return super.sendSuccessResponse("Travel bookings retrieved successfully", {
      page,
      page_size,
      count,
      results
    })
  }

  @Get("/agent/travel/:travel_id")
  async findByTravel(
    @Param("travel_id") travel_id: string,
    @Query() query: PaginationQueryDto,
    @Query("auth_org") agency_id?: string
  ) {
    if (!isValidObjectId(travel_id) || !isValidObjectId(agency_id))
      return super.sendErrorResponse("Travel not found", HttpStatus.NOT_FOUND)

    const { count, results, page, page_size } = await this.travelBookingService.findAll(query, {
      agency_id,
      travel_id
    })
    return super.sendSuccessResponse("Travel bookings retrieved successfully", {
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
    const booking = await this.travelBookingService.findOne({
      booking_id: id,
      agency_id
    })
    if (!booking) return super.sendErrorResponse("Booking not found", HttpStatus.NOT_FOUND)
    return super.sendSuccessResponse("Booking found", booking)
  }
}
