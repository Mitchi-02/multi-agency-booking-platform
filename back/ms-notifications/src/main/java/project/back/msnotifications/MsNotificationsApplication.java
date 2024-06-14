package project.back.msnotifications;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
@EnableCaching
public class MsNotificationsApplication implements CommandLineRunner{

	public static void main(String[] args) {
		SpringApplication.run(MsNotificationsApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		System.out.println("Notifications service started");
	}

	@GetMapping("/test")
	public String test() {
		return "Hello from notifications";
	}
}
