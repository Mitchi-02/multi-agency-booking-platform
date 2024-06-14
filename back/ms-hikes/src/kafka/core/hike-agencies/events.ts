import { BaseEvent } from "../base/BaseEvent"
import { HikeAgencyEventType } from "../base/types"
import { HikeAgencyTopicPayload } from "./payload"

export class BaseHikeAgencyEvent extends BaseEvent<HikeAgencyEventType, HikeAgencyTopicPayload> {
  constructor(type: HikeAgencyEventType, data: HikeAgencyTopicPayload) {
    super(type, data)
  }
}

export class HikeAgencyDeletedEvent extends BaseHikeAgencyEvent {
  constructor(data: HikeAgencyTopicPayload) {
    super(HikeAgencyEventType.DELETE, data)
  }
}
