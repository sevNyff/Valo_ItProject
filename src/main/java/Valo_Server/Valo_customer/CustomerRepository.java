package Valo_Server.Valo_customer;

import Valo_Server.Valo_truck.Truck;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Integer> {
}