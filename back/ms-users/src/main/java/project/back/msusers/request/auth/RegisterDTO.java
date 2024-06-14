package project.back.msusers.request.auth;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import project.back.msusers.entity.Gender;

@Data
public class RegisterDTO {

    @NotBlank(message = "First name is required")
    private String first_name;

    @NotBlank(message = "Last name is required")
    private String last_name;

    @NotBlank(message = "Email is required")
    @Email(message = "Email is invalid")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    @NotBlank(message = "Confirm password is required")
    private String confirm_password;

    @NotBlank(message = "Address is required")
    private String address;

    @NotBlank(message = "Phone is required")
    private String phone;

    @NotBlank(message = "Birth date is required")
    private String birth_date;

    @NotBlank(message = "Gender is required")
    private String gender;

    @AssertTrue(message = "Passwords do not match")
    private boolean isConfirm_password() {
        if (this.password == null || this.confirm_password == null) {
            return false;
        }
        return this.password.equals(this.confirm_password);
    }

    @AssertTrue(message = "Invalid gender, must be MALE | FEMALE")
    private boolean isGender(){
        if(this.gender == null) return false;
        for (Gender g : Gender.values()) {
            if (g.toString().equals(this.gender)) {
                return true;
            }
        }
        return false;
    }

    @AssertTrue(message = "Invalid birth date, must be in the past and in the format YYYY-MM-dd")
    private boolean isBirth_date() {
        if(this.birth_date == null) return false;
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
