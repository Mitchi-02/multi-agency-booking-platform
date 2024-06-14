import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query } from "@nestjs/common"
import { TravelService } from "src/travel/travel.service"
import { TravelBookingService } from "./travel-booking.service"
import { isValidObjectId } from "mongoose"
import { BaseController } from "src/utils/base.controller"
import { PaginationQueryDto } from "src/utils/dto/pagination-query.dto"
import { CreateTravelBookingDto } from "./dto/create-booking.dto"
import { UpdateTravelBookingDto } from "./dto/update-booking.dto"
import { TravelAgencyService } from "src/travel-agency/travel-agency.service"
import { BookingStatus, PaymentMethod } from "src/schemas/TravelBooking.schema"

@Controller("booking")
export class TravelBookingController extends BaseController {
  constructor(
    private readonly travelService: TravelService,
    private readonly travelAgencyService: TravelAgencyService,
    private readonly travelBookingService: TravelBookingService
  ) {
    super()
  }

  // auth
  @Post("/auth")
  async create(@Query("auth_id") user_id: number, @Body() createTravelBookingDto: CreateTravelBookingDto) {
    if (!isValidObjectId(createTravelBookingDto.travel))
      return super.sendErrorResponse("Travel not found", HttpStatus.NOT_FOUND)

    const travel = await this.travelService.findOne(createTravelBookingDto.travel)
    if (!travel) return super.sendErrorResponse("Travel not found", HttpStatus.NOT_FOUND)

    if (travel.places_left < createTravelBookingDto.bookers.length) {
      return super.sendErrorResponse("Not enough places left", HttpStatus.BAD_REQUEST)
    }

    return super.sendSuccessResponse(
      "Bookings created successfully",
      await this.travelBookingService.create(user_id, createTravelBookingDto, travel)
    )
  }

  @Put("/auth/:id")
  async updateMine(@Query("auth_id") user_id: number, @Param("id") id: string, @Body() body: CreateTravelBookingDto) {
    if (!isValidObjectId(id)) return super.sendErrorResponse("Booking not found", HttpStatus.NOT_FOUND)

    const booking = await this.travelBookingService.findOne({
      booking_id: id,
      user_id
    })
    if (!booking) return super.sendErrorResponse("Booking not found", HttpStatus.NOT_FOUND)

    if (booking.travel.places_left < body.bookers.length - booking.booking_items.length)
      return super.sendErrorResponse("Not enough places left", HttpStatus.BAD_REQUEST)
    if (booking.method === PaymentMethod.CASH || booking.paid)
      return super.sendErrorResponse("Booking already set to cash payment or already payed", HttpStatus.BAD_REQUEST)
    return super.sendSuccessResponse(
      "Booking updated successfully",
      await this.travelBookingService.update(booking, {
        paid: false,
        method: PaymentMethod.CARD,
        bookers: body.bookers.map((b) => ({
          ...b,
          status: BookingStatus.PENDING
        }))
      })
    )
  }

  @Delete("/auth/:id")
  async removeMine(@Param("id") id: string, @Query("auth_id") user_id: number) {
    if (!isValidObjectId(id)) return super.sendErrorResponse("Booking not found", HttpStatus.NOT_FOUND)
    const booking = await this.travelBookingService.findOne({
      booking_id: id,
      user_id
    })
    if (!booking) return super.sendErrorResponse("Booking not found", HttpStatus.NOT_FOUND)

    if (booking.method === PaymentMethod.CASH || booking.paid)
      return super.sendErrorResponse("Booking already set to cash payment or already payed", HttpStatus.BAD_REQUEST)

    await this.travelBookingService.remove(booking)
    return super.sendSuccessResponse("Booking deleted successfully", booking)
  }

  @Get("/auth")
  async findMine(@Query() query: PaginationQueryDto, @Query("auth_id") user_id: number) {
    const { count, results, page, page_size } = await this.travelBookingService.findAll(query, {
      user_id
    })
    return super.sendSuccessResponse("Travel bookings retrieved successfully", {
      page,
      page_size,
      count,
      results
    })
  }

  @Get("/auth/travel/:travel_id")
  async findMineOneByTravel(@Param("travel_id") travel_id: string, @Query("auth_id") user_id?: number) {
    if (!isValidObjectId(travel_id)) return super.sendErrorResponse("Booking not found", HttpStatus.NOT_FOUND)
    const booking = await this.travelBookingService.findOne({ travel_id, user_id })
    if (!booking) return super.sendErrorResponse("Booking not found", HttpStatus.NOT_FOUND)
    return super.sendSuccessResponse("Unfinished booking found", booking)
  }

  @Get("/auth/:id")
  async findMineOne(@Param("id") id: string, @Query("auth_id") user_id?: number) {
    if (!isValidObjectId(id)) return super.sendErrorResponse("Booking not found", HttpStatus.NOT_FOUND)
    const booking = await this.travelBookingService.findOne({ booking_id: id, user_id })
    if (!booking) return super.sendErrorResponse("Booking not found", HttpStatus.NOT_FOUND)
    return super.sendSuccessResponse("Booking found", booking)
  }

  // travel agent
  @Get("/agent")
  async findByAgency(@Query() query: PaginationQueryDto, @Query("auth_org") agency_id?: string) {
    if (!isValidObjectId(agency_id) || !(await this.travelAgencyService.findOne(agency_id, true)))
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

  @Put("/agent/:id")
  async update(@Param("id") id: string, @Body() body: UpdateTravelBookingDto, @Query("auth_org") agency_id?: string) {
    if (!isValidObjectId(id) || !isValidObjectId(agency_id))
      return super.sendErrorResponse("Booking not found", HttpStatus.NOT_FOUND)

    const booking = await this.travelBookingService.findOne({
      booking_id: id,
      agency_id
    })
    if (!booking) return super.sendErrorResponse("Booking not found", HttpStatus.NOT_FOUND)

    if (booking.travel.places_left < body.bookers.length - booking.booking_items.length)
      return super.sendErrorResponse("Not enough places left", HttpStatus.BAD_REQUEST)
    return super.sendSuccessResponse(
      "Booking updated successfully",
      await this.travelBookingService.update(booking, body)
    )
  }

  @Delete("/agent/:id")
  async remove(@Param("id") id: string, @Query("auth_org") agency_id?: string) {
    if (!isValidObjectId(id)) return super.sendErrorResponse("Booking not found", HttpStatus.NOT_FOUND)
    const booking = await this.travelBookingService.findOne({
      booking_id: id,
      agency_id
    })
    if (!booking) return super.sendErrorResponse("Booking not found", HttpStatus.NOT_FOUND)

    return super.sendSuccessResponse("Booking deleted successfully", await this.travelBookingService.remove(booking))
  }
}
