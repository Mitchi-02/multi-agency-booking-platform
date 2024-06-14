import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Put, Query } from "@nestjs/common"
import { HikeService } from "src/hike/hike.service"
import { HikeBookingService } from "./hike-booking.service"
import { isValidObjectId } from "mongoose"
import { BaseController } from "src/utils/base.controller"
import { PaginationQueryDto } from "src/utils/dto/pagination-query.dto"
import { CreateHikeBookingDto } from "./dto/create-booking.dto"
import { UpdateHikeBookingDto } from "./dto/update-booking.dto"
import { HikeAgencyService } from "src/hike-agency/hike-agency.service"
import { BookingStatus, PaymentMethod } from "src/schemas/HikeBooking.schema"

@Controller("booking")
export class HikeBookingController extends BaseController {
  constructor(
    private readonly hikeService: HikeService,
    private readonly hikeAgencyService: HikeAgencyService,
    private readonly hikeBookingService: HikeBookingService
  ) {
    super()
  }

  // auth
  @Post("/auth")
  async create(@Query("auth_id") user_id: number, @Body() createHikeBookingDto: CreateHikeBookingDto) {
    if (!isValidObjectId(createHikeBookingDto.hike))
      return super.sendErrorResponse("Hike not found", HttpStatus.NOT_FOUND)

    const hike = await this.hikeService.findOne(createHikeBookingDto.hike)
    if (!hike) return super.sendErrorResponse("Hike not found", HttpStatus.NOT_FOUND)

    if (hike.places_left < createHikeBookingDto.bookers.length) {
      return super.sendErrorResponse("Not enough places left", HttpStatus.BAD_REQUEST)
    }

    return super.sendSuccessResponse(
      "Bookings created successfully",
      await this.hikeBookingService.create(user_id, createHikeBookingDto, hike)
    )
  }

  @Put("/auth/:id")
  async updateMine(@Query("auth_id") user_id: number, @Param("id") id: string, @Body() body: UpdateHikeBookingDto) {
    if (!isValidObjectId(id)) return super.sendErrorResponse("Booking not found", HttpStatus.NOT_FOUND)

    const booking = await this.hikeBookingService.findOne({
      booking_id: id,
      user_id
    })
    if (!booking) return super.sendErrorResponse("Booking not found", HttpStatus.NOT_FOUND)

    if (booking.hike.places_left < body.bookers.length - booking.booking_items.length)
      return super.sendErrorResponse("Not enough places left", HttpStatus.BAD_REQUEST)
    if (booking.method === PaymentMethod.CASH || booking.paid)
      return super.sendErrorResponse("Booking already set to cash payment or already payed", HttpStatus.BAD_REQUEST)
    return super.sendSuccessResponse(
      "Booking updated successfully",
      await this.hikeBookingService.update(booking, {
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
    const booking = await this.hikeBookingService.findOne({
      booking_id: id,
      user_id
    })
    if (!booking) return super.sendErrorResponse("Booking not found", HttpStatus.NOT_FOUND)

    if (booking.method === PaymentMethod.CASH || booking.paid)
      return super.sendErrorResponse("Booking already set to cash payment or already payed", HttpStatus.BAD_REQUEST)

    await this.hikeBookingService.remove(booking)
    return super.sendSuccessResponse("Booking deleted successfully", booking)
  }

  @Get("/auth")
  async findMine(@Query() query: PaginationQueryDto, @Query("auth_id") user_id: number) {
    const { count, results, page, page_size } = await this.hikeBookingService.findAll(query, {
      user_id
    })
    return super.sendSuccessResponse("Hike bookings retrieved successfully", {
      page,
      page_size,
      count,
      results
    })
  }

  @Get("/auth/hike/:hike_id")
  async findMineOneByHike(@Param("hike_id") hike_id: string, @Query("auth_id") user_id?: number) {
    if (!isValidObjectId(hike_id)) return super.sendErrorResponse("Booking not found", HttpStatus.NOT_FOUND)
    const booking = await this.hikeBookingService.findOne({ hike_id, user_id })
    if (!booking) return super.sendErrorResponse("Booking not found", HttpStatus.NOT_FOUND)
    return super.sendSuccessResponse("Unfinished booking found", booking)
  }

  @Get("/auth/:id")
  async findMineOne(@Param("id") id: string, @Query("auth_id") user_id?: number) {
    if (!isValidObjectId(id)) return super.sendErrorResponse("Booking not found", HttpStatus.NOT_FOUND)
    const booking = await this.hikeBookingService.findOne({ booking_id: id, user_id })
    if (!booking) return super.sendErrorResponse("Booking not found", HttpStatus.NOT_FOUND)
    return super.sendSuccessResponse("Booking found", booking)
  }

  // hike agent
  @Get("/agent")
  async findByAgency(@Query() query: PaginationQueryDto, @Query("auth_org") agency_id?: string) {
    if (!isValidObjectId(agency_id) || !(await this.hikeAgencyService.findOne(agency_id, true)))
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

  @Put("/agent/:id")
  async update(@Param("id") id: string, @Body() body: UpdateHikeBookingDto, @Query("auth_org") agency_id?: string) {
    if (!isValidObjectId(id) || !isValidObjectId(agency_id))
      return super.sendErrorResponse("Booking not found", HttpStatus.NOT_FOUND)

    const booking = await this.hikeBookingService.findOne({
      booking_id: id,
      agency_id
    })
    if (!booking) return super.sendErrorResponse("Booking not found", HttpStatus.NOT_FOUND)

    if (booking.hike.places_left < body.bookers.length - booking.booking_items.length)
      return super.sendErrorResponse("Not enough places left", HttpStatus.BAD_REQUEST)
    return super.sendSuccessResponse(
      "Booking updated successfully",
      await this.hikeBookingService.update(booking, body)
    )
  }

  @Delete("/agent/:id")
  async remove(@Param("id") id: string, @Query("auth_org") agency_id?: string) {
    if (!isValidObjectId(id)) return super.sendErrorResponse("Booking not found", HttpStatus.NOT_FOUND)
    const booking = await this.hikeBookingService.findOne({
      booking_id: id,
      agency_id
    })
    if (!booking) return super.sendErrorResponse("Booking not found", HttpStatus.NOT_FOUND)
    return super.sendSuccessResponse("Booking deleted successfully", await this.hikeBookingService.remove(booking))
  }
}
