import { BaseEvent } from "../base/BaseEvent"
import { TravelBookingEventType } from "../base/types"
import { TravelBookingTopicPayload } from "./payload"

export class BaseTravelBookingEvent extends BaseEvent<TravelBookingEventType, TravelBookingTopicPayload> {
  constructor(type: TravelBookingEventType, data: TravelBookingTopicPayload) {
    super(type, data)
  }
}

export class TravelBookingDeletedEvent extends BaseTravelBookingEvent {
  constructor(data: TravelBookingTopicPayload) {
    super(TravelBookingEventType.DELETE, data)
  }
}

export class TravelBookingCreatedEvent extends BaseTravelBookingEvent {
  constructor(data: TravelBookingTopicPayload) {
    super(TravelBookingEventType.CREATE, data)
  }
}

export class TravelBookingUpdatedEvent extends BaseTravelBookingEvent {
  constructor(data: TravelBookingTopicPayload) {
    super(TravelBookingEventType.UPDATE, data)
  }
}
