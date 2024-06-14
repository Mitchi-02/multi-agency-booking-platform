package project.back.msregistry;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@EnableEurekaServer
@RestController
public class MsRegistryApplication implements CommandLineRunner{

    public static void main(String[] args) {
        SpringApplication.run(MsRegistryApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("Eureka server started");
    }

    @GetMapping("/test")
	public String test() {
		return "Hello from registry";
	}
}
