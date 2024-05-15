package Valo_Server.Valo_customer;

import Valo_Server.Valo_helper.Token;
import Valo_Server.Valo_tourEngine.tourGenerator;
import Valo_Server.Valo_tours.Tour;
import Valo_Server.Valo_tours.TourException;
import Valo_Server.Valo_truck.Truck;
import Valo_Server.Valo_truck.TruckException;
import Valo_Server.Valo_truck.TruckRepository;
import Valo_Server.Valo_user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*") // Allow cross-origin requests (necessary for web clients)
public class CustomerController {
    private static CustomerRepository repository;

    CustomerController(CustomerRepository repository) {CustomerController.repository = repository;}

    @PostMapping("/customers/new")
    public int newCustomer(@RequestBody Customer customer) {
        if (Token.validate(customer.getToken())) {
            System.out.println(customer.toString());
            Customer customer1 = new Customer(customer.getCustomerName(), customer.getAddressName(), customer.getCityName());
            repository.save(customer1);
            return customer1.getCustomerID();
        } else {
            throw new CustomerException("Invalid token");
        }
    }
    @GetMapping("/customers/delete/{CustomerID}")
    public String deleteTruck(@PathVariable int CustomerID) {
        Optional<Customer> oldCustomer = repository.findById(CustomerID);
        if (oldCustomer.isPresent()) {
            Customer customer = oldCustomer.get();
            repository.delete(customer);
            return "Customer deleted";
        } else {
            throw new NoSuchElementException("No customer found with ID " + CustomerID);
        }
    }

    @GetMapping("/customers")
    List<Customer> all() {
        return repository.findAll();
    }

    @GetMapping("customers/{CustomerID}")
    Customer one(@PathVariable int TruckID) {
        return repository.findById(TruckID)
                .orElseThrow(() -> new CustomerException("\"" + TruckID + "\" does not exist"));
    }

    public static CustomerRepository getRepository() {return repository;}
}

