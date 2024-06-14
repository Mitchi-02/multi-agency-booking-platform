export class HikePaymentTopicPayload {
  public booking_id: string
  public method?: string
  public paid?: boolean

  constructor(booking_id: string, method?: string, paid?: boolean) {
    this.booking_id = booking_id
    this.method = method
    this.paid = paid
  }
}
