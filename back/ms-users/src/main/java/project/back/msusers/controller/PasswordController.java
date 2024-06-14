package project.back.msusers.controller;

import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import project.back.msusers.entity.User;
import project.back.msusers.exception.ResponseException;
import project.back.msusers.request.pw.ResetPwDTO;
import project.back.msusers.request.pw.SendResetPwDTO;
import project.back.msusers.service.TokenService;
import project.back.msusers.service.UserService;


@RestController
@RequestMapping("/password")
public class PasswordController extends BaseController {
  
  @Resource
  private TokenService tokenService;

  @Resource
  private UserService userService;
  

  @PostMapping("/send")
  private ResponseEntity<?> send(@Valid @RequestBody SendResetPwDTO body) {
    Optional<User> user = userService.getUserByEmail(body.getEmail());
    if (user.isEmpty()) {
      return super.sendErrorResponse("No user found with this email", HttpStatus.NOT_FOUND);
    }
    this.tokenService.sendPwReset(user.get(), body.getEmail());
    return super.sendSuccessResponse("Reset password sent successfully");
  }

  @PostMapping("/reset")
    private ResponseEntity<?> reset(@Valid @RequestBody ResetPwDTO body) {
      Optional<User> user = userService.getUserByEmail(body.getEmail());
      if (user.isEmpty()) {
        return super.sendErrorResponse("No user found with this email", HttpStatus.NOT_FOUND);
      }
      try {
        this.tokenService.resetPassword(user.get(), body.getCode(), body.getPassword());
        return super.sendSuccessResponse("Password reset successfully");
      } catch (ResponseException e) {
        return super.sendErrorResponse(e.getMessage(), HttpStatus.FORBIDDEN);
      }
    }
}
