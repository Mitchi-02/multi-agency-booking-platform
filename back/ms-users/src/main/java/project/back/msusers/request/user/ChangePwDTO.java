package project.back.msusers.request.user;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ChangePwDTO {

  @NotBlank(message = "Current password is required")
  private String current_password;
  
  @NotBlank(message = "Password is required")
  private String password;

  @NotBlank(message = "Confirm password is required")
  private String confirm_password;

  @AssertTrue(message = "Passwords do not match")
  private boolean isConfirm_password() {
    if (this.password == null || this.confirm_password == null) {
      return false;
    }
    return this.password.equals(this.confirm_password);
  }
}
