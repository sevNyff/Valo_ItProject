package Valo_Server.Valo_truck;

import Valo_Server.Valo_helper.Token;
import Valo_Server.Valo_tourEngine.tourGenerator;
import Valo_Server.Valo_tours.Tour;
import Valo_Server.Valo_tours.TourException;
import Valo_Server.Valo_user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*") // Allow cross-origin requests (necessary for web clients)
public class TruckController {
    private static TruckRepository repository;

    TruckController(TruckRepository repository) {
        TruckController.repository = repository;
    }

    @PostMapping("/trucks/new")
    public int newTruck(@RequestBody Truck truck) {
        if (Token.validate(truck.getToken())) {
            Truck truck1 = new Truck(truck.getBrandName(), truck.getTruckCapacity());
            repository.save(truck1);
            return truck1.getID();
        } else {
            throw new TruckException("Invalid token");
        }
    }
    @GetMapping("/trucks/delete/{TruckID}")
    public String deleteTruck(@PathVariable int TruckID) {
        Optional<Truck> oldTruck = repository.findById(TruckID);
        if (oldTruck.isPresent()) {
            Truck truck = oldTruck.get();
            repository.delete(truck);
            return "Truck deleted";
        } else {
            throw new NoSuchElementException("No car found with ID " + TruckID);
        }
    }

    @GetMapping("/trucks")
    List<Truck> all() {
        return repository.findAll();
    }

    @GetMapping("trucks/{TruckID}")
    Truck one(@PathVariable int TruckID) {
        return repository.findById(TruckID)
                .orElseThrow(() -> new TruckException("\"" + TruckID + "\" does not exist"));
    }

   public static TruckRepository getRepository() {return repository;}
}
