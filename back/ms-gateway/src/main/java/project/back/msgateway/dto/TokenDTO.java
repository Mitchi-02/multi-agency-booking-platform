package project.back.msgateway.dto;


import lombok.Data;



@Data
public class TokenDTO {

  @Data
  public class User { 
    private Long id;

    private String first_name;

    private String last_name;

    private String email;

    private String address;

    private String phone;

    private String profile_picture;

    private String role;
    
    private boolean verified;

    private String organization_id;
  }

  private String message;

  private User data;
}