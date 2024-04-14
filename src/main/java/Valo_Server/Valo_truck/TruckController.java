package Valo_Server.Valo_truck;

import Valo_Server.Valo_helper.Token;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*") // Allow cross-origin requests (necessary for web clients)
public class TruckController {
    private static TruckRespository repository;

    TruckController(TruckRespository repository) {
        TruckController.repository = repository;
    }

    @PostMapping("/truck/new")
    Truck newTour(@RequestBody Truck truck) {
        if (Token.validate(truck.getToken())) {

            // etwas machen

            return repository.save(truck);
        } else {
            throw new TruckException("Invalid token");
        }
    }
    @PostMapping("/truck/quit")
    Truck quitGame(@RequestBody Truck truck) {
        // Villicht ned mid em token validate sondern mit de ID
        if (Token.validate(truck.getToken())) {
            repository.delete(truck);
            //etwas machen
            return truck;
        } else {
            throw new TruckException("Invalid token");
        }
    }
    @PostMapping("/truck/save")
    Truck tourSave(@RequestBody Truck truck) {

        // Tour sichern und route erstellen
        return truck;
    }

    @GetMapping("/trucks")
    List<Truck> all() {
        return repository.findAll();
    }

    public static TruckRespository getRepository() {return repository;}
}
