package Valo_Server.Valo_tours;

import Valo_Server.Valo_helper.Token;
import Valo_Server.Valo_packages.Package;
import Valo_Server.Valo_packages.PackageException;
import Valo_Server.Valo_packages.PackageRepository;
import Valo_Server.Valo_tourEngine.tourGenerator;
import Valo_Server.Valo_user.User;
import Valo_Server.Valo_user.UserException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin(origins = "*") // Allow cross-origin requests (necessary for web clients)
public class TourController {
    @Autowired
    private TourRepository tourRepository;

    @Autowired
    private PackageRepository packageRepository;

    /*
    @PostMapping("/tours/new")
    Tour newTour(@RequestBody Tour tour) {
        if (Token.validate(tour.getToken())) {
            return repository.save(tour);
        } else {
            throw new TourException("Invalid token");
        }
    }

     */
    @PostMapping("/tours/quit")
    Tour tourDelete(@RequestBody Tour tour) {
        // Villicht ned mid em token validate sondern mit de ID
        if (Token.validate(tour.getToken())) {
            tourRepository.delete(tour);
            return tour;
        } else {
            throw new TourException("Invalid token");
        }
    }
    @PostMapping("/tours/save")
    Tour tourSave(@RequestBody Tour tour) {
        if (Token.validate(tour.getToken())) {
            System.out.println("Received Tour object: " + tour);

            Tour tourIn = new Tour(tour.getTruckID());
            tourIn.setToken(tour.getToken());

            List<Package> packages = new ArrayList<>();
            for (Package packageIn : tour.getPackages()){
                Package pck = new Package(packageIn.getPackageWeight(), packageIn.getDeliveryAddress());
                pck.setTours(tourIn);
                packages.add(pck);
            }
            tourIn.setPackages(packages);
            tourRepository.save(tourIn);

            System.out.println("Tour saved");

            //tourGenerator.generateTour(tourIn);

            return tourIn;
        } else {
            throw new TourException("Invalid token");
        }
    }

    @PostMapping("/packages/save")
    public String savePackage(@RequestBody Package aPackage) {
        if (Token.validate(aPackage.getToken())) {
            Tour tourTemp = tourRepository.getById(aPackage.getPackageID());

            List<Package> packages = new ArrayList<>();
            Package pck = new Package(aPackage.getPackageWeight(), aPackage.getDeliveryAddress());

            pck.setTours(tourTemp);
            packages.add(pck);
            tourTemp.setPackages(packages);
            tourRepository.save(tourTemp);
            packageRepository.save(aPackage);

            return "Package saved";
        } else {
            throw new PackageException("Invalid token");
        }
    }



    @GetMapping("/tours")
    List<Tour> allTours() {
        return tourRepository.findAll();
    }
    @GetMapping("/packages")
    List<Package> allpackages() {
        return packageRepository.findAll();
    }

    @GetMapping("tours/{ID}")
    Tour oneTour(@PathVariable int ID) {
        return tourRepository.findById(ID)
                .orElseThrow(() -> new TourException("\"" + ID + "\" does not exist"));
    }

    @GetMapping("packages/{ID}")
    Package onePackage(@PathVariable int ID) {
        return packageRepository.findById(ID)
                .orElseThrow(() -> new PackageException("\"" + ID + "\" does not exist"));
    }

    /*
    public static TourRepository getTourRepository() {return tourRepository;}
    public static PackageRepository getPackageRepository() {return packageRepository;}
     */
}
