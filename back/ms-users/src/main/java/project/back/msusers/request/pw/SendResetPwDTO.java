package project.back.msusers.request.pw;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SendResetPwDTO {
  @NotBlank(message = "Email is required")
  @Email(message = "Invalid email")
  private String email;
}
