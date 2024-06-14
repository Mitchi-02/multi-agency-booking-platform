package project.back.msnotifications.events.core.travel_reviews;

import project.back.msnotifications.events.core.base.BaseEvent;
import project.back.msnotifications.events.core.base.types.TravelReviewEventType;

public class BaseTravelReviewEvent extends BaseEvent<TravelReviewEventType, TravelReviewTopicPayload> {
    public BaseTravelReviewEvent(TravelReviewEventType type, TravelReviewTopicPayload data) {
        super(type, data);
    }
}
