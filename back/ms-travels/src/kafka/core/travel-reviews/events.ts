import { BaseEvent } from "../base/BaseEvent"
import { TravelReviewEventType } from "../base/types"
import { TravelReviewTopicPayload } from "./payload"

export class BaseTravelReviewEvent extends BaseEvent<TravelReviewEventType, TravelReviewTopicPayload> {
  constructor(type: TravelReviewEventType, data: TravelReviewTopicPayload) {
    super(type, data)
  }
}

export class TravelReviewCreatedEvent extends BaseTravelReviewEvent {
  constructor(data: TravelReviewTopicPayload) {
    super(TravelReviewEventType.CREATE, data)
  }
}
