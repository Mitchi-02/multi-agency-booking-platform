package project.back.msnotifications.events.core.hike_payments;

import project.back.msnotifications.events.core.base.BaseEvent;
import project.back.msnotifications.events.core.base.types.HikePaymentEventType;

public class BaseHikePaymentEvent extends BaseEvent<HikePaymentEventType, HikePaymentTopicPayload> {
    public BaseHikePaymentEvent(HikePaymentEventType type, HikePaymentTopicPayload data) {
        super(type, data);
    }
}
