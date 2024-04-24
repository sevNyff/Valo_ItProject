package Valo_Server.Valo_tours;

import Valo_Server.Valo_helper.Token;
import Valo_Server.Valo_tourEngine.tourGenerator;
import Valo_Server.Valo_user.User;
import Valo_Server.Valo_user.UserException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*") // Allow cross-origin requests (necessary for web clients)
public class TourController {
    private static TourRepository repository;

    TourController(TourRepository repository) {
        TourController.repository = repository;
    }

    @PostMapping("/tours/new")
    Tour newTour(@RequestBody Tour tour) {
        if (Token.validate(tour.getToken())) {
            return repository.save(tour);
        } else {
            throw new TourException("Invalid token");
        }
    }
    @PostMapping("/tours/quit")
    Tour quitGame(@RequestBody Tour tour) {
        // Villicht ned mid em token validate sondern mit de ID
        if (Token.validate(tour.getToken())) {
            repository.delete(tour);
            return tour;
        } else {
            throw new TourException("Invalid token");
        }
    }
    @PostMapping("/tours/save")
    Tour tourSave(@RequestBody Tour tour) {
        if (Token.validate(tour.getToken())) {
            tour = tourGenerator.generateTour(tour);
            return repository.save(tour);
        } else {
            throw new TourException("Invalid token");
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



    @GetMapping("/tours")
    List<Tour> all() {
        return repository.findAll();
    }

    @GetMapping("tours/{ID}")
    Tour one(@PathVariable String ID) {
        return repository.findById(ID)
                .orElseThrow(() -> new TourException("\"" + ID + "\" does not exist"));
    }

    public static TourRepository getRepository() {return repository;}
}
