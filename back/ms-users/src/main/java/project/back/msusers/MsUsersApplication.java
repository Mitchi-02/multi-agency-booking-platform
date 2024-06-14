package project.back.msusers;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
@EnableFeignClients
@EnableCaching
public class MsUsersApplication implements CommandLineRunner {

	public static void main(String[] args) {
		SpringApplication.run(MsUsersApplication.class, args);
	}

	@Override
	public void run(String... args){
		System.out.println("Users service started");
	}

	@GetMapping("/test")
	public String test() { 
		return "Hello from ms-users";
	}
}
