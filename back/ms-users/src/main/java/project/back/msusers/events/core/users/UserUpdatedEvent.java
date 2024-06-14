package project.back.msusers.events.core.users;

import project.back.msusers.events.core.base.types.UserEventType;
import project.back.msusers.events.core.users.payload.UserTopicPayload;

public class UserUpdatedEvent extends BaseUserEvent {
    public UserUpdatedEvent(UserTopicPayload user) {
        super(UserEventType.UPDATE, user);
    }
}
