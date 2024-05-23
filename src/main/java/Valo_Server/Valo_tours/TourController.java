package Valo_Server.Valo_tours;

import Valo_Server.Valo_customer.Customer;
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

            Tour tourIn = new Tour(tour.getTruckID());

            List<Package> packages = new ArrayList<>();
            for (Package packageIn : tour.getPackages()) {
                Package pck = new Package(packageIn.getPackageWeight(), packageIn.getDeliveryAddress(), packageIn.getCustomerID());
                pck.setTours(tourIn);
                packages.add(pck);
            }
            tourIn.setPackages(packages);

            tourRepository.save(tourIn);
            System.out.println("Received Tour object: " + tourIn);

            System.out.println("Tour saved");

            return tourIn;
        } else {
            throw new TourException("Invalid token");
        }
    }
    @PostMapping("/tours/generate")
    Tour tourGenerate(@RequestBody Tour tour) {
        if (Token.validate(tour.getToken())) {

            Tour tourIn = new Tour(tour.getTruckID());

            List<Package> packages = new ArrayList<>();
            for (Package packageIn : tour.getPackages()) {
                Package pck = new Package(packageIn.getPackageWeight(), packageIn.getDeliveryAddress(), packageIn.getCustomerID());
                pck.setTours(tourIn);
                packages.add(pck);
            }
            tourIn.setPackages(packages);


            tourIn = tourGenerator.generateTour(tourIn);

            //tourRepository.save(tourIn);
            System.out.println("Received Tour object: " + tourIn);

            System.out.println("Tour saved");

            return tourIn;
        } else {
            throw new TourException("Invalid token");
        }
    }

    @GetMapping("/tours")
    List<Tour> allTours() {
        return tourRepository.findAll();
    }
    @GetMapping("tours/{ID}")
    Tour oneTour(@PathVariable int ID) {
        return tourRepository.findById(ID)
                .orElseThrow(() -> new TourException("\"" + ID + "\" does not exist"));
    }
}
