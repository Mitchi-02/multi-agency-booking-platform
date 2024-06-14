package project.back.msusers.events.core.users.payload;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserTopicPayload {
  private Long id;
  private String email;
  private String first_name;
  private String last_name;
  private String phone;
  private String profile_picture;
  private String address;
  private String code;

  public UserTopicPayload(Long id, String email, String code) {
    this.id = id;
    this.email = email;
    this.code = code;
  }

  public UserTopicPayload(Long id, String email) {
    this.id = id;
  }
}
