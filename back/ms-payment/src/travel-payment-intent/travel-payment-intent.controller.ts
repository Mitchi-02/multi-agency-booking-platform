import { Controller, Post, Param, HttpStatus, Query, Get } from "@nestjs/common"

import { BaseController } from "src/utils/base.controller"
import { TravelPaymentIntentService } from "./travel-payment-intent.service"
import { PaymentMethod } from "src/models"

@Controller("travel_payment")
export class TravelPaymentIntentController extends BaseController {
  constructor(private readonly travelPaymentIntentService: TravelPaymentIntentService) {
    super()
  }

  @Get("/auth/:booking_id")
  async getPayment(@Param("booking_id") booking_id: string, @Query("user_id") user_id: number) {
    const payment = await this.travelPaymentIntentService.findOneBy({
      booking_id,
      user_id
    })
    if (!payment) {
      return this.sendErrorResponse("Payment not found", HttpStatus.NOT_FOUND)
    }
    return this.sendSuccessResponse("Trip payment retreived", payment)
  }

  @Post("/auth/cash/:booking_id")
  async updateCashPayment(@Param("booking_id") booking_id: string, @Query("user_id") user_id: number) {
    const payment = await this.travelPaymentIntentService.findOneBy({
      booking_id,
      user_id
    })
    if (!payment) {
      return this.sendErrorResponse("Payment not found", HttpStatus.NOT_FOUND)
    }
    if (payment.paid || payment.method === PaymentMethod.CASH) {
      return this.sendErrorResponse("Payment already paid", HttpStatus.BAD_REQUEST)
    }
    return this.sendSuccessResponse(
      "Trip payment updated to cash",
      await this.travelPaymentIntentService.updatePaymentIntent(payment, {
        method: PaymentMethod.CASH,
        paid: false
      })
    )
  }

  @Post("/auth/:booking_id")
  async createPaymentSecret(@Param("booking_id") booking_id: string, @Query("user_id") user_id: number) {
    const payment = await this.travelPaymentIntentService.findOneBy({
      booking_id,
      user_id
    })
    if (!payment) {
      return this.sendErrorResponse("Payment not found", HttpStatus.NOT_FOUND)
    }
    if (payment.paid) {
      return this.sendErrorResponse("Payment already paid", HttpStatus.BAD_REQUEST)
    }
    if (payment.method === PaymentMethod.CASH) {
      return this.sendErrorResponse("Payment method is already cash", HttpStatus.BAD_REQUEST)
    }
    return this.sendSuccessResponse(
      "Intent created",
      await this.travelPaymentIntentService.createPaymentIntentSecret(payment)
    )
  }
}
