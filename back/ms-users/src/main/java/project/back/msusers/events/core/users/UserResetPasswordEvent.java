package project.back.msusers.events.core.users;

import project.back.msusers.events.core.base.types.UserEventType;
import project.back.msusers.events.core.users.payload.UserTopicPayload;

public class UserResetPasswordEvent extends BaseUserEvent {
    public UserResetPasswordEvent(UserTopicPayload data) {
        super(UserEventType.RESET_PASSWORD, data);
    }
}
