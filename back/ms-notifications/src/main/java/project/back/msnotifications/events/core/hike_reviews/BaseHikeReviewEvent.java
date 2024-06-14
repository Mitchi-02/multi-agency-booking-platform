package project.back.msnotifications.events.core.hike_reviews;

import project.back.msnotifications.events.core.base.BaseEvent;
import project.back.msnotifications.events.core.base.types.HikeReviewEventType;

public class BaseHikeReviewEvent extends BaseEvent<HikeReviewEventType, HikeReviewTopicPayload> {
    public BaseHikeReviewEvent(HikeReviewEventType type, HikeReviewTopicPayload data) {
        super(type, data);
    }
}
