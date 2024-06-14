package project.back.msusers.events.core.users;

import project.back.msusers.events.core.base.types.UserEventType;
import project.back.msusers.events.core.users.payload.UserTopicPayload;

public class UserEmailVerificationEvent extends BaseUserEvent {
    public UserEmailVerificationEvent(UserTopicPayload data) {
        super(UserEventType.EMAIL_VERIFICATION, data);
    }
}
