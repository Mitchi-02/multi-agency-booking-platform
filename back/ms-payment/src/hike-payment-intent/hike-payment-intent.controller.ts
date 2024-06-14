import { Controller, Post, Body, Patch, Param, HttpStatus, Query, Delete, Get } from "@nestjs/common"

import { BaseController } from "src/utils/base.controller"
import { HikePaymentIntentService } from "./hike-payment-intent.service"
import { PaymentMethod } from "src/models"

@Controller("hike_payment")
export class HikePaymentIntentController extends BaseController {
  constructor(private readonly hikePaymentIntentService: HikePaymentIntentService) {
    super()
  }

  @Get("/auth/:booking_id")
  async getPayment(@Param("booking_id") booking_id: string, @Query("user_id") user_id: number) {
    const payment = await this.hikePaymentIntentService.findOneBy({
      booking_id,
      user_id
    })
    if (!payment) {
      return this.sendErrorResponse("Payment not found", HttpStatus.NOT_FOUND)
    }
    return this.sendSuccessResponse("Hike payment retreived", payment)
  }

  @Post("/auth/cash/:booking_id")
  async updateCashPayment(@Param("booking_id") booking_id: string, @Query("user_id") user_id: number) {
    const payment = await this.hikePaymentIntentService.findOneBy({
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
      "Hike payment updated to cash",
      await this.hikePaymentIntentService.updatePaymentIntent(payment, {
        method: PaymentMethod.CASH,
        paid: false
      })
    )
  }

  @Post("/auth/:booking_id")
  async createPaymentSecret(@Param("booking_id") booking_id: string, @Query("user_id") user_id: number) {
    const payment = await this.hikePaymentIntentService.findOneBy({
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
      await this.hikePaymentIntentService.createPaymentIntentSecret(payment)
    )
  }
}
