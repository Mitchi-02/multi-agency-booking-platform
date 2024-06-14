package project.back.msnotifications.events.core.travel_bookings;

import project.back.msnotifications.events.core.base.BaseEvent;
import project.back.msnotifications.events.core.base.types.TravelBookingEventType;

public class BaseTravelBookingEvent extends BaseEvent<TravelBookingEventType, TravelBookingTopicPayload> {
    public BaseTravelBookingEvent(TravelBookingEventType type, TravelBookingTopicPayload data) {
        super(type, data);
    }
}
