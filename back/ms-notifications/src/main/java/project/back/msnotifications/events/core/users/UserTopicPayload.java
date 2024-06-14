package project.back.msnotifications.events.core.users;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserTopicPayload {
  private Long id;
  private String email;
  private String code;
}
