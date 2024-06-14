package project.back.msnotifications.events.core.travel_reviews;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TravelReviewTopicPayload {
  private String id;
  private String rating;
  private String comment;
  private Long user_id;
  private String booking_id;
  private String travel_id;
  private String agency_id;
  private Integer reviews_count;
}
