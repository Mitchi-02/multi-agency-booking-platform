package project.back.msgateway;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class MsGatewayApplication implements CommandLineRunner{

    public static void main(String[] args) {
        SpringApplication.run(MsGatewayApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("Gateway service started");
    }

    @GetMapping("/test")
	public String test() {
		return "Hello from gateway";
	}
}
