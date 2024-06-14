import { BaseEvent } from "../base/BaseEvent"
import { HikePaymentEventType } from "../base/types"
import { HikePaymentTopicPayload } from "./payload"

export class BaseHikePaymentEvent extends BaseEvent<HikePaymentEventType, HikePaymentTopicPayload> {
  constructor(type: HikePaymentEventType, data: HikePaymentTopicPayload) {
    super(type, data)
  }
}

export class HikePaymentUpdatedEvent extends BaseHikePaymentEvent {
  constructor(data: HikePaymentTopicPayload) {
    super(HikePaymentEventType.UPDATE, data)
  }
}
