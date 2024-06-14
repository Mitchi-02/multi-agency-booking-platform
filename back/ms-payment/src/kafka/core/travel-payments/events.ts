import { BaseEvent } from "../base/BaseEvent"
import { TravelPaymentEventType } from "../base/types"
import { TravelPaymentTopicPayload } from "./payload"

export class BaseTravelPaymentEvent extends BaseEvent<TravelPaymentEventType, TravelPaymentTopicPayload> {
  constructor(type: TravelPaymentEventType, data: TravelPaymentTopicPayload) {
    super(type, data)
  }
}

export class TravelPaymentUpdatedEvent extends BaseTravelPaymentEvent {
  constructor(data: TravelPaymentTopicPayload) {
    super(TravelPaymentEventType.UPDATE, data)
  }
}
