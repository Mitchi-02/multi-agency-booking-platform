package project.back.msusers.request.pw;

import org.hibernate.validator.constraints.Length;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import project.back.msusers.service.TokenService;

@Data
public class ResetPwDTO {
  
  @NotBlank(message = "Password is required")
  private String password;

  @NotBlank(message = "Confirm password is required")
  private String confirm_password;

  @NotBlank(message = "Code is required")
  @Length(min= TokenService.CODE_LENGTH,
          max= TokenService.CODE_LENGTH,
          message = "Code must be " + TokenService.CODE_LENGTH + " characters")
  private String code;

  @NotBlank(message = "Email is required")
  @Email(message = "Invalid email")
  private String email;

  @AssertTrue(message = "Passwords do not match")
  private boolean isConfirm_password() {
    if (this.password == null || this.confirm_password == null) {
      return false;
    }
    return this.password.equals(this.confirm_password);
  }
}
