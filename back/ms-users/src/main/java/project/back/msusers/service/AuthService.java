package project.back.msusers.service;

import jakarta.annotation.Resource;

import java.io.IOException;
import java.sql.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import project.back.msusers.entity.Gender;
import project.back.msusers.entity.Role;
import project.back.msusers.entity.TokenType;
import project.back.msusers.entity.User;
import project.back.msusers.events.EventService;
import project.back.msusers.events.core.users.UserEmailVerificationEvent;
import project.back.msusers.events.core.users.payload.UserTopicPayload;
import project.back.msusers.exception.ResponseException;
import project.back.msusers.repository.UserRepository;
import project.back.msusers.request.auth.AuthDTO;
import project.back.msusers.request.auth.RegisterDTO;
import project.back.msusers.response.token.TokenResponseDTO;

@Service
@Slf4j
public class AuthService {

    @Resource
    private UserRepository userRepository;
    @Resource
    private PasswordEncoder passwordEncoder;
    @Resource
    private JwtService jwtService;
    @Resource
    private TokenService tokenService;
    @Resource
    private StorageService storageService;

    @Resource
    private EventService eventService;
    
    static final String BASE_PATH = "users/";

    public TokenResponseDTO authenticate(AuthDTO request, Role role) throws ResponseException {
        User u = userRepository.findByEmail(request.getEmail()).orElseThrow(() -> new ResponseException("Wrong credentials"));
        if(!passwordEncoder.matches(request.getPassword(), u.getPassword())) {
            throw new ResponseException("Wrong credentials");
        }

        if(role!=null && !u.getRole().equals(role)) {
            throw new ResponseException("Not authorized to login as " + role.name());
        }

        HashMap<String, Object> claims = new HashMap<>();
        claims.put("user", u);
        return new TokenResponseDTO(jwtService.create(claims, u.getId().toString()), u);
    }

    public boolean emailAlreadyUsed(String email) {
        return userRepository.findByEmail(email).isPresent();
    }

    public TokenResponseDTO register(RegisterDTO request, MultipartFile profile_picture) throws ResponseException, IOException {
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setAddress(request.getAddress());
        user.setPhone(request.getPhone());
        user.setFirst_name(request.getFirst_name().toLowerCase());
        user.setLast_name(request.getLast_name().toLowerCase());
        if(profile_picture != null) {
            user.setProfile_picture(this.storageService.save(AuthService.BASE_PATH, profile_picture));
        }
        user.setRole(Role.CLIENT);
        user.setVerified(false);
        user.setOrganization_id(null);
        user.setBirth_date(Date.valueOf(request.getBirth_date()));
        user.setGender(Gender.valueOf(request.getGender()));
        user.setCompleted(true);
        userRepository.save(user);
        HashMap<String, Object> claims = new HashMap<>();
        claims.put("user", user);
        this.eventService.sendEvent(
                new UserEmailVerificationEvent(
                        new UserTopicPayload(user.getId(), user.getEmail(),
                                this.tokenService.createToken(user, TokenType.EMAIL_VERIFICATION))
                )
        );
        return new TokenResponseDTO(jwtService.create(claims, user.getId().toString()), user);
    }

    public Object validate(String token, Role role) throws ResponseException {
        try {
            Claims c = jwtService.validate(token);
            LinkedHashMap u = (LinkedHashMap) c.get("user");
            if(role == null) {
                return u;
            }
            if(!u.get("role").equals(role.name())) {
                throw new ResponseException("Not authorized to access this resource");
            }
            return u;
        } catch (JwtException | IllegalArgumentException e) {
            throw new ResponseException("Not authenticated");
        }
    }
}
