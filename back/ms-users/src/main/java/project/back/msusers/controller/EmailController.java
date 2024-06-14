package project.back.msusers.controller;

import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import project.back.msusers.entity.User;
import project.back.msusers.exception.ResponseException;
import project.back.msusers.request.verif.VerificationDTO;
import project.back.msusers.service.TokenService;
import project.back.msusers.service.UserService;


@RestController
@RequestMapping("/email")
public class EmailController extends BaseController {
  
  @Resource
  private TokenService tokenService;
  @Resource
  private UserService userService;
  
  
  @PostMapping("/verify")
    private ResponseEntity<?> verify(@RequestParam Long auth_id, @Valid @RequestBody VerificationDTO body) {
      Optional<User> user = userService.getUserById(auth_id);
      if (user.isEmpty()) {
        return super.sendErrorResponse("No user found with this id", HttpStatus.NOT_FOUND);
      }
      try {
        return super.sendSuccessResponse("Email verified successfully", this.tokenService.verifyToken(user.get(), body.getCode()));
      } catch (ResponseException e) {
        return super.sendErrorResponse(e.getMessage(), HttpStatus.FORBIDDEN);
      }
    }

    @PostMapping("/resend")
    private ResponseEntity<?> resend(@RequestParam Long auth_id, @RequestParam String auth_email) {
      this.tokenService.resendVerification(auth_id, auth_email);
      return super.sendSuccessResponse("Email verification resend successfully");
    }
}
