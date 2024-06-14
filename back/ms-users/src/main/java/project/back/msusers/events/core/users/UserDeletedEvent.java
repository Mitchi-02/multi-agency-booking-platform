package project.back.msusers.events.core.users;

import project.back.msusers.events.core.base.types.UserEventType;
import project.back.msusers.events.core.users.payload.UserTopicPayload;

public class UserDeletedEvent extends BaseUserEvent {
    public UserDeletedEvent(UserTopicPayload user) {
        super(UserEventType.DELETE, user);
    }
}
