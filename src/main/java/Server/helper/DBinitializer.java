package Server.helper;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import Server.user.User;
import Server.user.UserRepository;
@Configuration
public class DBinitializer {
    private static final Logger log = LoggerFactory.getLogger(DBinitializer.class);

    @Bean
    CommandLineRunner initDatabase(UserRepository ur) {

        return args -> {
            User brad = new User("test", "test");
            log.info("Preloading " + ur.save(brad));
        };

    }
}
