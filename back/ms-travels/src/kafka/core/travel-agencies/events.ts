import { BaseEvent } from "../base/BaseEvent"
import { TravelAgencyEventType } from "../base/types"
import { TravelAgencyTopicPayload } from "./payload"

export class BaseTravelAgencyEvent extends BaseEvent<TravelAgencyEventType, TravelAgencyTopicPayload> {
  constructor(type: TravelAgencyEventType, data: TravelAgencyTopicPayload) {
    super(type, data)
  }
}

export class TravelAgencyDeletedEvent extends BaseTravelAgencyEvent {
  constructor(data: TravelAgencyTopicPayload) {
    super(TravelAgencyEventType.DELETE, data)
  }
}
