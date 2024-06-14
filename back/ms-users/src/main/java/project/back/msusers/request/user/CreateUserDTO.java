package project.back.msusers.request.user;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import project.back.msusers.entity.Gender;
import project.back.msusers.entity.Role;

@Data
public class CreateUserDTO {

    private String first_name;

    private String last_name;

    @NotBlank(message = "Email is required")
    @Email(message = "Email is invalid")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    @NotBlank(message = "Confirm password is required")
    private String confirm_password;

    private String address;

    private String phone;

    private String birth_date;

    private String gender;

    @NotBlank(message = "Role is required")
    private String role;

    @AssertTrue(message = "Passwords do not match")
    private boolean isConfirm_password() {
      if (this.password == null || this.confirm_password == null) {
        return false;
      }
      return this.password.equals(this.confirm_password);
    }

    private String organization_id;

    @AssertTrue(message="Organization id is required")
    private boolean isOrganization_id(){
      if(Role.ADMIN.toString().equals(this.role) || Role.CLIENT.toString().equals(this.role)){
        return true;
      }
      return this.organization_id != null && !this.organization_id.isEmpty();
    }

    @AssertTrue(message="Invalid role")
    private boolean isRole(){
      if(this.role == null) return false;
      for (Role r : Role.values()) {
          if (r.toString().equals(this.role)) {
            return true;
          }
      }
      return false;
    }

    @AssertTrue(message = "Invalid gender, must be MALE | FEMALE")
    private boolean isGender(){
      if(this.gender == null) return true;
      for (Gender g : Gender.values()) {
          if (g.toString().equals(this.gender)) {
            return true;
          }
      }
      return false;
    }

    @AssertTrue(message = "Invalid birth date, must be in the past and in the format YYYY-MM-dd")
    private boolean isBirth_date() {
      if (this.birth_date == null) {
          return true;
      }
      try {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        Date date = dateFormat.parse(this.birth_date);
        Date currentDate = new Date();
        return date.before(currentDate);
      } catch (ParseException e) {
        return false; 
      }
    }
}
