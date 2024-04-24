package Valo_Server.Valo_truck;

import Valo_Server.Valo_helper.Token;
import Valo_Server.Valo_tourEngine.tourGenerator;
import Valo_Server.Valo_tours.Tour;
import Valo_Server.Valo_tours.TourException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*") // Allow cross-origin requests (necessary for web clients)
public class TruckController {
    private static TruckRepository repository;

    TruckController(TruckRepository repository) {
        TruckController.repository = repository;
    }

    @PostMapping("/trucks/new")
    Truck newTour(@RequestBody Truck truck) {
        if (Token.validate(truck.getToken())) {
            return repository.save(truck);
        } else {
            throw new TruckException("Invalid token");
        }
    }
    @PostMapping("/trucks/delete")
    Truck quitGame(@RequestBody Truck truck) {
        // Villicht ned mid em token validate sondern mit de ID
        if (Token.validate(truck.getToken())) {
            repository.delete(truck);
            return truck;
        } else {
            throw new TruckException("Invalid token");
        }
    }

    @GetMapping("/trucks")
    List<Truck> all() {
        return repository.findAll();
    }

    @GetMapping("tours/{TruckID}")
    Truck one(@PathVariable String TruckID) {
        return repository.findById(TruckID)
                .orElseThrow(() -> new TruckException("\"" + TruckID + "\" does not exist"));
    }

    public static TruckRepository getRepository() {return repository;}
}
