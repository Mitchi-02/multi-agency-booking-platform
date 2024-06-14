package project.back.msnotifications.events.core.travel_payments;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TravelPaymentTopicPayload {
  private String booking_id;
  private String method;
  private Boolean paid;
}
