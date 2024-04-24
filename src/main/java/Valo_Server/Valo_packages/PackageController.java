package Valo_Server.Valo_packages;

import Valo_Server.Valo_helper.Token;
import Valo_Server.Valo_tourEngine.tourGenerator;
import Valo_Server.Valo_tours.Tour;
import Valo_Server.Valo_tours.TourException;
import Valo_Server.Valo_user.User;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*") // Allow cross-origin requests (necessary for web clients)
public class PackageController {
    private static PackageRepository repository;

    PackageController(PackageRepository repository) {
        PackageController.repository = repository;
    }

    @PostMapping("/packages/add")
    Package newTour(@RequestBody Package aPackage) {
        if (Token.validate(aPackage.getToken())) {
            return repository.save(aPackage);
        } else {
            throw new PackageException("Invalid token");
        }
    }
    @PostMapping("/packages/delete")
    Package quitGame(@RequestBody Package aPackage) {
        if (Token.validate(aPackage.getToken())) {
            repository.delete(aPackage);
            return aPackage;
        } else {
            throw new PackageException("Invalid token");
        }
    }


    @GetMapping("/packages")
    List<Package> all() {
        return repository.findAll();
    }

    @GetMapping("tours/{ID}")
    Package one(@PathVariable String ID) {
        return repository.findById(ID)
                .orElseThrow(() -> new PackageException("\"" + ID + "\" does not exist"));
    }

    public static PackageRepository getRepository() {return repository;}
}
