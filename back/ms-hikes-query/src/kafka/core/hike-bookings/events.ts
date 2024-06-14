import { BaseEvent } from "../base/BaseEvent"
import { HikeBookingEventType } from "../base/types"
import { HikeBookingTopicPayload } from "./payload"

export class BaseHikeBookingEvent extends BaseEvent<HikeBookingEventType, HikeBookingTopicPayload> {
  constructor(type: HikeBookingEventType, data: HikeBookingTopicPayload) {
    super(type, data)
  }
}

export class HikeBookingDeletedEvent extends BaseHikeBookingEvent {
  constructor(data: HikeBookingTopicPayload) {
    super(HikeBookingEventType.DELETE, data)
  }
}

export class HikeBookingCreatedEvent extends BaseHikeBookingEvent {
  constructor(data: HikeBookingTopicPayload) {
    super(HikeBookingEventType.CREATE, data)
  }
}

export class HikeBookingUpdatedEvent extends BaseHikeBookingEvent {
  constructor(data: HikeBookingTopicPayload) {
    super(HikeBookingEventType.UPDATE, data)
  }
}
