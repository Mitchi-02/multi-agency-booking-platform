package project.back.msusers.request.verif;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.hibernate.validator.constraints.Length;
import project.back.msusers.service.TokenService;

@Data
public class VerificationDTO {

  @NotBlank(message = "Code is required")
  @Length(min= TokenService.CODE_LENGTH,
          max= TokenService.CODE_LENGTH,
          message = "Code must be " + TokenService.CODE_LENGTH + " characters")
  private String code;
}
