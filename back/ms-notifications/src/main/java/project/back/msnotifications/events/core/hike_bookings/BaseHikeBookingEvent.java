package project.back.msnotifications.events.core.hike_bookings;

import project.back.msnotifications.events.core.base.BaseEvent;
import project.back.msnotifications.events.core.base.types.HikeBookingEventType;

public class BaseHikeBookingEvent extends BaseEvent<HikeBookingEventType, HikeBookingTopicPayload> {
    public BaseHikeBookingEvent(HikeBookingEventType type, HikeBookingTopicPayload data) {
        super(type, data);
    }
}
