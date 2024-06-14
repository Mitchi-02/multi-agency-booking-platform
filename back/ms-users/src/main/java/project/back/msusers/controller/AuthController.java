package project.back.msusers.controller;

import java.io.IOException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import project.back.msusers.entity.Role;
import project.back.msusers.exception.ResponseException;
import project.back.msusers.request.auth.AuthDTO;
import project.back.msusers.request.auth.RegisterDTO;
import project.back.msusers.service.AuthService;


@RestController
@RequestMapping("/auth")
public class AuthController extends BaseController {
  
  @Resource
  private AuthService authService;

  
  @PostMapping("/register")
    private ResponseEntity<?> register(@Valid @ModelAttribute RegisterDTO request, @RequestParam(required = false) MultipartFile profile_picture) throws IOException {
      if(this.authService.emailAlreadyUsed(request.getEmail())) {
          return super.sendErrorResponse("Email already used", HttpStatus.BAD_REQUEST);
      }
      try {
        return super.sendSuccessResponse("Registered Successfully", this.authService.register(request, profile_picture), HttpStatus.CREATED);
      } catch (ResponseException e) {
        return super.sendErrorResponse(e.getMessage(), HttpStatus.BAD_REQUEST);
      }
    }

    @PostMapping("/login")
    private ResponseEntity<?> loginClient(@Valid @RequestBody AuthDTO request) {
      try {
        return super.sendSuccessResponse("Logged in Successfully", this.authService.authenticate(request, null));
      } catch (ResponseException e) {
        return super.sendErrorResponse(e.getMessage(), HttpStatus.UNAUTHORIZED);
      }  
    }

    @PostMapping("/login/admin")
    private ResponseEntity<?> loginAdmin(@Valid @RequestBody AuthDTO request) {
      try {
        return super.sendSuccessResponse("Logged in Successfully as admin", this.authService.authenticate(request, Role.ADMIN));
      } catch (ResponseException e) {
        return super.sendErrorResponse(e.getMessage(), HttpStatus.UNAUTHORIZED);
      }  
    }

    @PostMapping("/login/hike")
    private ResponseEntity<?> loginHikeAgent(@Valid @RequestBody AuthDTO request) {
      try {
        return super.sendSuccessResponse("Logged in Successfully as hike agent", this.authService.authenticate(request, Role.HIKE_AGENT));
      } catch (ResponseException e) {
        return super.sendErrorResponse(e.getMessage(), HttpStatus.UNAUTHORIZED);
      }  
    }

    @PostMapping("/login/travel")
    private ResponseEntity<?> loginTravelAgent(@Valid @RequestBody AuthDTO request) {
      try {
        return super.sendSuccessResponse("Logged in Successfully as travel agent", this.authService.authenticate(request, Role.TRAVEL_AGENT));
      } catch (ResponseException e) {
        return super.sendErrorResponse(e.getMessage(), HttpStatus.UNAUTHORIZED);
      }  
    }

    @GetMapping("/token")
    private ResponseEntity<?> token(@RequestParam String token) {
      try {
        return super.sendSuccessResponse("Token verified", 
          this.authService.validate(token, null));
      } catch (ResponseException e) {
        return super.sendErrorResponse(e.getMessage(), HttpStatus.UNAUTHORIZED);
      }
    }

    @GetMapping("/token/admin")
    private ResponseEntity<?> tokenAdmin(@RequestParam String token) {
      try {
        return super.sendSuccessResponse("Token verified", 
          this.authService.validate(token, Role.ADMIN));
      } catch (ResponseException e) {
        return super.sendErrorResponse(e.getMessage(), HttpStatus.UNAUTHORIZED);
      }
    }

    @GetMapping("/token/hike")
    private ResponseEntity<?> tokenHike(@RequestParam String token) {
      try {
        return super.sendSuccessResponse("Token verified", 
          this.authService.validate(token, Role.HIKE_AGENT));
      } catch (ResponseException e) {
        return super.sendErrorResponse(e.getMessage(), HttpStatus.UNAUTHORIZED);
      }
    }

    @GetMapping("/token/travel")
    private ResponseEntity<?> tokenTravel(@RequestParam String token) {
      try {
        return super.sendSuccessResponse("Token verified", 
          this.authService.validate(token, Role.TRAVEL_AGENT));
      } catch (ResponseException e) {
        return super.sendErrorResponse(e.getMessage(), HttpStatus.UNAUTHORIZED);
      }
    }
}
