import { BaseEvent } from "../base/BaseEvent"
import { TravelBookingEventType } from "../base/types"
import { HikeBookingTopicPayload } from "./payload"

export class BaseHikeBookingEvent extends BaseEvent<TravelBookingEventType, HikeBookingTopicPayload> {
  constructor(type: TravelBookingEventType, data: HikeBookingTopicPayload) {
    super(type, data)
  }
}

export class HikeBookingDeletedEvent extends BaseHikeBookingEvent {
  constructor(data: HikeBookingTopicPayload) {
    super(TravelBookingEventType.DELETE, data)
  }
}

export class HikeBookingCreatedEvent extends BaseHikeBookingEvent {
  constructor(data: HikeBookingTopicPayload) {
    super(TravelBookingEventType.CREATE, data)
  }
}

export class HikeBookingUpdatedEvent extends BaseHikeBookingEvent {
  constructor(data: HikeBookingTopicPayload) {
    super(TravelBookingEventType.UPDATE, data)
  }
}
