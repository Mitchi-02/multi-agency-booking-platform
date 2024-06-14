import { BaseEvent } from "../base/BaseEvent"
import { HikeReviewEventType } from "../base/types"
import { HikeReviewTopicPayload } from "./payload"

export class BaseHikeReviewEvent extends BaseEvent<HikeReviewEventType, HikeReviewTopicPayload> {
  constructor(type: HikeReviewEventType, data: HikeReviewTopicPayload) {
    super(type, data)
  }
}

export class HikeReviewCreatedEvent extends BaseHikeReviewEvent {
  constructor(data: HikeReviewTopicPayload) {
    super(HikeReviewEventType.CREATE, data)
  }
}
