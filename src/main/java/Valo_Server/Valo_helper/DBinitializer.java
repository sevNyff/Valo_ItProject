package Valo_Server.Valo_helper;

import Valo_Server.Valo_customer.Customer;
import Valo_Server.Valo_customer.CustomerRepository;
import Valo_Server.Valo_truck.Truck;
import Valo_Server.Valo_truck.TruckRepository;
import Valo_Server.Valo_user.User;
import Valo_Server.Valo_user.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DBinitializer {
    private static final Logger log = LoggerFactory.getLogger(DBinitializer.class);

    @Bean
    CommandLineRunner initDatabaseUser(UserRepository userRepository) {
        return args -> {
            User brad = new User("test", "test");
            log.info("Preloading User: " + userRepository.save(brad));
        };
    }

    @Bean
    CommandLineRunner initDatabaseCustomer(CustomerRepository customerRepository) {
        return args -> {
            Customer customer1 = new Customer("Severin Nyffenegger", "Hauptstrasse 2", "Brugg");
            Customer customer2 = new Customer("Kevin Bernet", "Waldweg 69", "Luzern");
            log.info("Preloading Customer: " + customerRepository.save(customer1));
            log.info("Preloading Customer: " + customerRepository.save(customer2));
        };
    }

    @Bean
    CommandLineRunner initDatabaseTruck(TruckRepository truckRepository) {
        return args -> {
            Truck truck1 = new Truck("Mercedes", 5);
            Truck truck2 = new Truck("Scania", 8);
            log.info("Preloading Truck: " + truckRepository.save(truck1));
            log.info("Preloading Truck: " + truckRepository.save(truck2));
        };
    }
}
