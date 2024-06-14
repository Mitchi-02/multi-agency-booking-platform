package project.back.msusers.controller;

import java.io.IOException;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import project.back.msusers.entity.Role;
import project.back.msusers.entity.User;
import project.back.msusers.exception.ResponseException;
import project.back.msusers.request.user.ChangePwDTO;
import project.back.msusers.request.user.CreateUserDTO;
import project.back.msusers.request.user.UpdateProfileDTO;
import project.back.msusers.response.user.FindUsersResponseDTO;
import project.back.msusers.service.UserService;


@RestController
@RequestMapping("/user")
public class UserController extends BaseController {
  
  private static final String DEFAULT_PAGE_SIZE = "10";
  private static final String DEFAULT_PAGE = "1";

  @Resource
  private UserService userService;
  

  @PatchMapping("/infos")
  private ResponseEntity<?> update(
    @RequestParam Long auth_id, @RequestParam String auth_email, 
    @Valid @ModelAttribute UpdateProfileDTO body,
    @RequestParam(required = false) MultipartFile profile_picture
  ) throws IOException {
    Optional<User> user = userService.getUserById(auth_id);
    if (user.isEmpty()) {
      return super.sendErrorResponse("No user found", HttpStatus.NOT_FOUND);
    }

    try {
      return super.sendSuccessResponse(
              (body.getEmail() != null && !body.getEmail().equals(auth_email)) ? "Infos updated. A verification email has been sent to your email address."
                      : "Infos updated successfully" ,
              userService.updateInfos(user.get(), body, profile_picture));
    } catch (ResponseException e) {
      return super.sendErrorResponse(e.getMessage(), HttpStatus.FORBIDDEN);
    }
  }

  @PostMapping("/password")
  private ResponseEntity<?> password(@RequestParam Long auth_id, @Valid @RequestBody ChangePwDTO body) {
    Optional<User> user = userService.getUserById(auth_id);
    if (user.isEmpty()) {
      return super.sendErrorResponse("No user found", HttpStatus.NOT_FOUND);
    }
    try {
      userService.updatePassword(user.get(), body.getCurrent_password(), body.getPassword());
      return super.sendSuccessResponse("Password updated successfully");
    } catch (ResponseException e) {
      return super.sendErrorResponse(e.getMessage(), HttpStatus.FORBIDDEN);
    }
  }
  

  @GetMapping("/admin")
  private ResponseEntity<?> index(
        @RequestParam(required = false) String search,
        @RequestParam(required = false) String role,
        @RequestParam(defaultValue = UserController.DEFAULT_PAGE) String page,
        @RequestParam(defaultValue = UserController.DEFAULT_PAGE_SIZE) String page_size) {
    
    int pageInt = Integer.parseInt(page);
    int pageSizeInt = Integer.parseInt(page_size);
    if(pageInt < 1 || pageSizeInt < 1) {
      return super.sendErrorResponse("Bad request params given", HttpStatus.UNPROCESSABLE_ENTITY);
    }
    String s = search == null || search.isEmpty() ? null : search;
    try {
      Role r = role == null ? null : Role.valueOf(role);
      Page<User> users = userService.findAll(pageInt, pageSizeInt, s, r);
      return super.sendSuccessResponse("Users retrieved successfully", 
        new FindUsersResponseDTO(pageInt, pageSizeInt, users.getTotalElements(), users.getContent()));
    } catch (IllegalArgumentException | NullPointerException e) {
      return super.sendErrorResponse("Bad request params given", HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  @GetMapping("/admin/{id}")
  private ResponseEntity<?> show(@PathVariable Long id) throws ResponseException {
    try {
      return super.sendSuccessResponse("User retrieved successfully", userService.findOne(id));
    } catch (Exception e) {
      return super.sendErrorResponse(e.getMessage(), HttpStatus.NOT_FOUND);
    }
  }

  @PostMapping("/admin")
  private ResponseEntity<?> store(@Valid @RequestBody CreateUserDTO body) {
    try {
      return super.sendSuccessResponse("User created successfully", userService.create(body));
    } catch (ResponseException e) {
      return super.sendErrorResponse(e.getMessage(), HttpStatus.FORBIDDEN);
    }
  }

  @DeleteMapping("/admin/{id}")
  private ResponseEntity<?> delete(@PathVariable Long id) {
    try {
      return super.sendSuccessResponse("User deleted successfully", userService.delete(id));
    } catch (Exception e) {
      return super.sendErrorResponse(e.getMessage(), HttpStatus.NOT_FOUND);
    }
  }

  @PostMapping("/internal")
  private ResponseEntity<?> storeInternal(@Valid @RequestBody CreateUserDTO body) {
    try {
      return super.sendSuccessResponse("User created successfully", userService.createOrUpdate(body));
    } catch (ResponseException e) {
      return super.sendErrorResponse(e.getMessage(), HttpStatus.FORBIDDEN);
    }
  }

  @GetMapping("/internal/{id}")
  private ResponseEntity<?> showInternal(@PathVariable Long id) throws ResponseException {
    try {
      return super.sendSuccessResponse("User retrieved successfully", userService.findOne(id));
    } catch (Exception e) {
      return super.sendErrorResponse(e.getMessage(), HttpStatus.NOT_FOUND);
    }
  }
}
