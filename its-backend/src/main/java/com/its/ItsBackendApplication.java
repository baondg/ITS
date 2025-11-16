package com.its;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@SpringBootApplication
@EnableMongoAuditing
public class ItsBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(ItsBackendApplication.class, args);
    }
}