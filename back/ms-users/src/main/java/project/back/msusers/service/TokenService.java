package project.back.msusers.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;
import jakarta.transaction.Transactional;
import project.back.msusers.entity.Token;
import project.back.msusers.entity.TokenType;
import project.back.msusers.entity.User;
import project.back.msusers.events.EventService;
import project.back.msusers.events.core.users.UserEmailVerificationEvent;
import project.back.msusers.events.core.users.UserResetPasswordEvent;
import project.back.msusers.events.core.users.payload.UserTopicPayload;
import project.back.msusers.exception.ResponseException;
import project.back.msusers.repository.TokenRepository;
import project.back.msusers.repository.UserRepository;
import project.back.msusers.response.token.TokenResponseDTO;

import java.sql.Timestamp;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Optional;


@Service
@Slf4j
public class  TokenService {
  
  private static final int EXPIRATION = 60 * 24; // 24 hours
  public static final int CODE_LENGTH = 6;

  @Resource
  private TokenRepository tokenRepository;
  @Resource
  private PasswordEncoder passwordEncoder;
  @Resource
  private UserRepository userRepository;
  @Resource
  private JwtService jwtService;
  @Resource
  private EventService eventService;

  public String createToken(User user, TokenType type) {
    Token token = new Token();
    token.setUser(user);
    token.setType(type);
    token.setExpires_at(
      this.calculateExpiryDate()
    );
    String code = this.generateCode();
    token.setCode(passwordEncoder.encode(code));
    tokenRepository.save(token);
    return code;
  }

  public TokenResponseDTO verifyToken(User user, String code) throws ResponseException {
    Optional<Token> token = tokenRepository.getFirstByUserAndType(user, TokenType.EMAIL_VERIFICATION);
    if (token.isEmpty()) {
      throw new ResponseException("Invalid token");
    }
    if (!passwordEncoder.matches(code, token.get().getCode())) {
      throw new ResponseException("Invalid token");
    }
    if (this.isExpired(token.get())) {
      tokenRepository.delete(token.get());
      throw new ResponseException("Token expired. Please request a new one");
    }
    tokenRepository.delete(token.get());
    user.setVerified(true);
    userRepository.save(user);

    HashMap<String, Object> claims = new HashMap<>();
    claims.put("user", user);
    return new TokenResponseDTO(jwtService.create(claims, user.getId().toString()), user);
  }

  @Transactional
  public void resendVerification(Long user_id, String email) {
    tokenRepository.deleteByUser_idAndType(user_id, TokenType.EMAIL_VERIFICATION);
    User user = new User();
    user.setId(user_id);
    String code = this.createToken(user, TokenType.EMAIL_VERIFICATION);
    this.eventService.sendEvent(
            new UserEmailVerificationEvent(
                    new UserTopicPayload(user_id, email, code)
            )
    );
  }

  @Transactional
  public void sendPwReset(User user, String email) {
    System.out.println("Sending password reset email");
    tokenRepository.deleteByUser_idAndType(user.getId(), TokenType.PASSWORD_RESET);
    System.out.println("Token deleted");
    String code = this.createToken(user, TokenType.PASSWORD_RESET);
    this.eventService.sendEvent(
            new UserResetPasswordEvent(
                    new UserTopicPayload(user.getId(), email, code)
            )
    );
  }

  public void resetPassword(User user, String code, String password) throws ResponseException {
    Optional<Token> token = tokenRepository.getFirstByUserAndType(user, TokenType.PASSWORD_RESET);
    if (token.isEmpty()) {
      throw new ResponseException("Invalid token");
    }
    if (!passwordEncoder.matches(code, token.get().getCode())) {
      throw new ResponseException("Invalid token");
    }
    if (this.isExpired(token.get())) {
      tokenRepository.delete(token.get());
      throw new ResponseException("Token expired. Please request a new one");
    }
    tokenRepository.delete(token.get());
    user.setPassword(passwordEncoder.encode(password));
    userRepository.save(user);
  }

  private String generateCode() {
    int code = (int) (Math.random() * Math.pow(10, CODE_LENGTH));
    return String.format("%06d", code);
  }

  private Date calculateExpiryDate() {
    Calendar cal = Calendar.getInstance();
    cal.setTime(new Timestamp(cal.getTime().getTime()));
    cal.add(Calendar.MINUTE, EXPIRATION);
    return new Date(cal.getTime().getTime());
  }

  private boolean isExpired(Token token) {
    return new Date().after(token.getExpires_at());
  }
}
