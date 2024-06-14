package project.back.msnotifications.events.core.users;

import project.back.msnotifications.events.core.base.BaseEvent;
import project.back.msnotifications.events.core.base.types.UserEventType;

public class BaseUserEvent extends BaseEvent<UserEventType, UserTopicPayload> {
    public BaseUserEvent(UserEventType type, UserTopicPayload data) {
        super(type, data);
    }
}
