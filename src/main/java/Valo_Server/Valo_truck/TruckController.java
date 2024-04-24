package Valo_Server.Valo_truck;

import Valo_Server.Valo_helper.Token;
import Valo_Server.Valo_tourEngine.tourGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
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
            return truck;
        } else {
            throw new TruckException("Invalid token");
        }
    }
    @PostMapping("/truck/save")
    Truck tourSave(@RequestBody Truck truck) {
        if (Token.validate(truck.getToken())) {
            truck = tourGenerator.generateTour(truck);
            return repository.save(truck);
        } else {
            throw new TruckException("Invalid token");
        }
    }
    /*
    @PostMapping("/truck/save")
    Truck tourSave(@RequestBody String json) throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        HashMap<String, String> map = mapper.readValue(json, HashMap.class);

        String token = map.get("token");
        if (Token.validate(token)){
            Truck truck = repository.findById(token).get();
            truck = tourGenerator.generateTour(truck);
            return repository.save(truck);
        } else {
            throw new TruckException("Invalid token");
        }
    }

    @PostMapping("/truck/save")
    Truck tourSave(@RequestBody Truck truck) {
        Optional<truck> oldTour = repository.findById(Truck.getID());
        if (oldTour.isEmpty()) {
            truck = tourGenerator.generateTour(truck);
            return repository.save(truck);
        } else {
           throw new UserException("Tour:'" + Truck.getID() + "' is already saved");
        }
    }

     */



    @GetMapping("/trucks")
    List<Truck> all() {
        return repository.findAll();
    }

    public static TruckRespository getRepository() {return repository;}
}
