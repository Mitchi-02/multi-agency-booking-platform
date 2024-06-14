package project.back.msusers.service;

import java.io.IOException;
import java.sql.Date;
import java.util.HashMap;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.Resource;
import project.back.msusers.entity.Gender;
import project.back.msusers.entity.Role;
import project.back.msusers.entity.TokenType;
import project.back.msusers.entity.User;
import project.back.msusers.events.EventService;
import project.back.msusers.events.core.users.UserDeletedEvent;
import project.back.msusers.events.core.users.UserEmailVerificationEvent;
import project.back.msusers.events.core.users.UserUpdatedEvent;
import project.back.msusers.events.core.users.payload.UserTopicPayload;
import project.back.msusers.exception.ResponseException;
import project.back.msusers.proxy.MsHikesProxy;
import project.back.msusers.proxy.MsTravelsProxy;
import project.back.msusers.repository.UserRepository;
import project.back.msusers.request.user.CreateUserDTO;
import project.back.msusers.request.user.UpdateProfileDTO;
import project.back.msusers.response.token.TokenResponseDTO;

@Service
public class UserService {
  @Resource
  private UserRepository userRepository;
  @Resource
  private JwtService jwtService;
  @Resource
  private TokenService tokenService;
  @Resource
  private PasswordEncoder passwordEncoder;
  @Resource
  private MsHikesProxy msHikesProxy;
  @Resource
  private MsTravelsProxy msTravelsProxy;
  @Resource
  private StorageService storageService;
  @Resource
  private EventService eventService;
  
  static final String BASE_PATH = "users/";

  public Optional<User> getUserByEmail(String email) {
    return userRepository.findByEmail(email);
  }

  public Optional <User> getUserById(Long id) {
    return userRepository.findById(id);
  }

  public TokenResponseDTO updateInfos(User user, UpdateProfileDTO body, MultipartFile profile_picture) throws ResponseException, IOException {
      if (body.getEmail() != null && !body.getEmail().equals(user.getEmail())) {
      if(this.getUserByEmail(body.getEmail()).isPresent()) {
        throw new ResponseException("Email already exists");
      }
      user.setEmail(body.getEmail());
      user.setVerified(false);
      this.eventService.sendEvent(
              new UserEmailVerificationEvent(
                      new UserTopicPayload(
                              user.getId(),
                              user.getEmail(),
                              tokenService.createToken(user, TokenType.EMAIL_VERIFICATION)
                      )
              )
      );
    }
    if (body.getFirst_name() != null) {
      user.setFirst_name(body.getFirst_name());
    }
    if (body.getLast_name() != null) {
      user.setLast_name(body.getLast_name());
    }
    if (body.getPhone() != null) {
      user.setPhone(body.getPhone());
    }
    if (body.getAddress() != null) {
      user.setAddress(body.getAddress());
    }
    if (profile_picture != null) {
      if(user.getProfile_picture() != null) {
        storageService.delete(user.getProfile_picture());
      }
      user.setProfile_picture(storageService.save(UserService.BASE_PATH, profile_picture));
    } else if(body.isDelete_profile_picture()){
      if(user.getProfile_picture() != null) {
        storageService.delete(user.getProfile_picture());
      }
      user.setProfile_picture(null);
    }
    if(body.getGender() != null) {
      user.setGender(Gender.valueOf(body.getGender()));
    }
    if(body.getBirth_date() != null) {
      user.setBirth_date(Date.valueOf(body.getBirth_date()));
    }
    user.setCompleted(true);
    userRepository.save(user);
    HashMap<String, Object> claims = new HashMap<>();
    claims.put("user", user);
    this.eventService.sendEvent(
            new UserUpdatedEvent(
                    new UserTopicPayload(user.getId(),
                            user.getEmail(),
                            user.getFirst_name(),
                            user.getLast_name(),
                            user.getPhone(),
                            user.getProfile_picture(),
                            user.getAddress(), null)
            )
    );
    return new TokenResponseDTO(jwtService.create(claims, user.getId().toString()), user);
  }

  public void updatePassword(User user, String current, String password) throws ResponseException{
    if (!passwordEncoder.matches(current, user.getPassword())) {
      throw new ResponseException("Current password is incorrect");
    }
    user.setPassword(passwordEncoder.encode(password));
    userRepository.save(user);
  }

  public User create(CreateUserDTO body) throws ResponseException {
    if(this.getUserByEmail(body.getEmail()).isPresent()) {
      throw new ResponseException("Email already exists");
    }
    if(this.checkOrg(body.getOrganization_id(), Role.valueOf(body.getRole())) == null) {
      throw new ResponseException("Organization not found");
    }
    User u = new User();
    u.setRole(Role.valueOf(body.getRole()));
    u.setOrganization_id(body.getOrganization_id());
    u.setEmail(body.getEmail());
    u.setFirst_name(body.getFirst_name());
    u.setLast_name(body.getLast_name());
    u.setPassword(passwordEncoder.encode(body.getPassword()));
    u.setAddress(body.getAddress());
    u.setPhone(body.getPhone());
    if(body.getBirth_date() != null) {
      u.setBirth_date(Date.valueOf(body.getBirth_date()));
    }
    if(body.getGender() != null) {
      u.setGender(Gender.valueOf(body.getGender()));
    }
    u.setVerified(true);
    u.setCompleted(false);
    userRepository.save(u);
    return u;
  }

  public Page<User> findAll(int page, int page_size, String search, Role role) {
    if(search == null && role == null) {
      return userRepository.findAll(PageRequest.of(page-1, page_size));
    }
    if(search != null && role != null) {
      return userRepository.search(search, role, PageRequest.of(page-1, page_size));
    }
    if(search != null) {
      return userRepository.search(search, PageRequest.of(page-1, page_size));
    }
    return userRepository.findByRole(role, PageRequest.of(page-1, page_size));
  }

  public User findOne(Long id) throws ResponseException{
    return userRepository.findById(id).orElseThrow(() -> new ResponseException("User not found"));
  }

  public User delete(Long id) throws ResponseException{
    User u = this.findOne(id);
    if(u.getProfile_picture() != null) {
      storageService.delete(u.getProfile_picture());
    }
    userRepository.delete(u);
    this.eventService.sendEvent(
            new UserDeletedEvent(
                    new UserTopicPayload(u.getId(), u.getEmail())
            )
    );
    return u;
  }

  public User createOrUpdate(CreateUserDTO body) throws ResponseException {
    Optional<User> u = this.getUserByEmail(body.getEmail());
    if(u.isPresent()) {
      u.get().setOrganization_id(body.getOrganization_id());
      u.get().setRole(Role.valueOf(body.getRole()));
      userRepository.save(u.get());
      return u.get();
    }
    User us = new User();
    us.setRole(Role.valueOf(body.getRole()));
    us.setOrganization_id(body.getOrganization_id());
    us.setEmail(body.getEmail());
    us.setFirst_name(body.getFirst_name());
    us.setLast_name(body.getLast_name());
    us.setPassword(passwordEncoder.encode(body.getPassword()));
    us.setAddress(body.getAddress());
    us.setPhone(body.getPhone());
    if(body.getBirth_date() != null) {
      us.setBirth_date(Date.valueOf(body.getBirth_date()));
    }
    if(body.getGender() != null) {
      us.setGender(Gender.valueOf(body.getGender()));
    }
    us.setVerified(true);
    us.setCompleted(true);
    us.setProfile_picture("users/default.png");
    userRepository.save(us);
    return us;
  }

  private Object checkOrg(String org_id, Role role) {
    try {
      if(Role.HIKE_AGENT.equals(role)) {
      return msHikesProxy.checkHikeAgency(org_id);
      } else if(Role.TRAVEL_AGENT.equals(role)) {
        return msTravelsProxy.checkTravelAgency(org_id);
      }
      return true;
    } catch (Exception e) {
      return null;
    }
  }
}
