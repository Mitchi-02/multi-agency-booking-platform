package project.back.msusers.request.user;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import lombok.Data;
import project.back.msusers.entity.Gender;

@Data
public class UpdateProfileDTO {

    @Email
    private String email;

    private String first_name;

    private String last_name;

    private String address;

    private String phone;

    private String birth_date;

    private boolean delete_profile_picture;

    private String gender;

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
        if(this.birth_date == null) return true;
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
