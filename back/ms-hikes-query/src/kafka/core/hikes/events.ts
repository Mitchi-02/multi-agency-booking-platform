import { BaseEvent } from "../base/BaseEvent"
import { HikeEventType } from "../base/types"
import { HikeTopicPayload } from "./payload"

export class BaseHikeEvent extends BaseEvent<HikeEventType, HikeTopicPayload> {
  constructor(type: HikeEventType, data: HikeTopicPayload) {
    super(type, data)
  }
}

export class HikeDeletedEvent extends BaseHikeEvent {
  constructor(data: HikeTopicPayload) {
    super(HikeEventType.DELETE, data)
  }
}
