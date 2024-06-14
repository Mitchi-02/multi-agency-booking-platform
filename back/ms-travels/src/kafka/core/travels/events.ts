import { BaseEvent } from "../base/BaseEvent"
import { TravelEventType } from "../base/types"
import { TravelTopicPayload } from "./payload"

export class BaseTravelEvent extends BaseEvent<TravelEventType, TravelTopicPayload> {
  constructor(type: TravelEventType, data: TravelTopicPayload) {
    super(type, data)
  }
}

export class TravelDeletedEvent extends BaseTravelEvent {
  constructor(data: TravelTopicPayload) {
    super(TravelEventType.DELETE, data)
  }
}
