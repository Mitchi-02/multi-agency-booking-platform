package project.back.msnotifications.events.core.travel_payments;

import project.back.msnotifications.events.core.base.BaseEvent;
import project.back.msnotifications.events.core.base.types.TravelPaymentEventType;

public class BaseTravelPaymentEvent extends BaseEvent<TravelPaymentEventType, TravelPaymentTopicPayload> {
    public BaseTravelPaymentEvent(TravelPaymentEventType type, TravelPaymentTopicPayload data) {
        super(type, data);
    }
}
