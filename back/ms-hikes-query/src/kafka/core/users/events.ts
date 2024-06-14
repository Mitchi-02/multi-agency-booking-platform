import { BaseEvent } from "../base/BaseEvent"
import { UserEventType } from "../base/types"
import { UserTopicPayload } from "./payload"

export class BaseUserEvent extends BaseEvent<UserEventType, UserTopicPayload> {
  constructor(type: UserEventType, data: UserTopicPayload) {
    super(type, data)
  }
}
