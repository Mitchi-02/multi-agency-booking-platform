package project.back.msnotifications.events.core.hike_payments;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class HikePaymentTopicPayload {
  private String booking_id;
  private String method;
  private Boolean paid;
}
