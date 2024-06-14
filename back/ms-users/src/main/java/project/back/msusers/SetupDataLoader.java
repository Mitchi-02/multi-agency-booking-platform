package project.back.msusers;

import jakarta.annotation.Resource;

import java.text.ParseException;
import java.text.SimpleDateFormat;

import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import jakarta.transaction.Transactional;
import project.back.msusers.entity.Gender;
import project.back.msusers.entity.Role;
import project.back.msusers.entity.User;
import project.back.msusers.repository.UserRepository;

@Component
public class SetupDataLoader implements
  ApplicationListener<ContextRefreshedEvent> {

    boolean alreadySetup = false;

    @Resource
    private UserRepository userRepository;
 
    @Resource
    private PasswordEncoder passwordEncoder;
 
    @Override
    @Transactional
    public void onApplicationEvent(ContextRefreshedEvent e) {
      if (alreadySetup) return;
      SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
      
      for(int i = 1; i < 11; i++) {
        User user = new User();
        user.setFirst_name("Client"+ i);
        user.setLast_name("Client"+ i);
        user.setPassword(passwordEncoder.encode("password"));
        user.setEmail("client@client"+ i +".com");
        user.setPhone("1234567890");
        user.setAddress("1234 Client St");
        user.setProfile_picture("users/default.png");
        user.setRole(Role.CLIENT);
        user.setVerified(true);
        user.setCompleted(true);
        user.setGender(Gender.MALE);
        try {
            user.setBirth_date(dateFormat.parse("2002-07-07"));
        } catch (ParseException ee) {
            ee.printStackTrace();
        }      
        userRepository.save(user);
      }

      User admin = new User();
      admin.setFirst_name("Admin");
      admin.setLast_name("Admin");
      admin.setPassword(passwordEncoder.encode("password"));
      admin.setEmail("admin@admin.com");
      admin.setPhone("1234567890");
      admin.setAddress("1234 Admin St");
      admin.setProfile_picture("users/default.png");
      admin.setRole(Role.ADMIN);
      admin.setVerified(true);
      admin.setCompleted(true);
      admin.setGender(Gender.MALE);
      try {
          admin.setBirth_date(dateFormat.parse("2002-07-07"));
      } catch (ParseException ee) {
          ee.printStackTrace();
      }   
      userRepository.save(admin);

      alreadySetup = true;
    }
}
