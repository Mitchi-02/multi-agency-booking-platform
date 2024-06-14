package project.back.msusers.response.token;

import lombok.AllArgsConstructor;
import lombok.Data;
import project.back.msusers.entity.User;

@Data
@AllArgsConstructor
public class TokenResponseDTO {
  private String token;
  private User user;
}
