package Valo_Server.Valo_helper;

import Valo_Server.Valo_truck.Truck;
import Valo_Server.Valo_truck.TruckRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import Valo_Server.Valo_user.User;
import Valo_Server.Valo_user.UserRepository;
@Configuration
public class DBinitializer {
    private static final Logger log = LoggerFactory.getLogger(DBinitializer.class);

    @Bean
    CommandLineRunner initDatabaseUser(UserRepository ur) {

        return args -> {
            User brad = new User("test", "test");
            log.info("Preloading " + ur.save(brad));
        };

    }

    @Bean
    CommandLineRunner initDatabaseTruck(TruckRepository truck) {

        return args -> {
            Truck tr = new Truck("Mercedes", 5);
            Truck tr2 = new Truck("Scania", 8);
            log.info("Preloading " + truck.save(tr));
            log.info("Preloading " + truck.save(tr2));
        };

    }
}
