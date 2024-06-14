package project.back.msnotifications.events.core.travel_bookings;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TravelBookingTopicPayload {
  public String id;
  public String price;
  public Long user_id;
  public Boolean paid;
  public String method;
  public String travel_id;
  public String agency_id;
  public Integer travel_places_left;
  public String travel_agency_name;
  public String travel_destination;
  public String travel_departure_date;
  public Object[] booking_items;
}
