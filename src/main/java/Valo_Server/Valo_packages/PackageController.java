package Valo_Server.Valo_packages;

import Valo_Server.Valo_helper.Token;
import Valo_Server.Valo_packages.Package;
import Valo_Server.Valo_packages.PackageException;
import Valo_Server.Valo_packages.PackageRepository;
import Valo_Server.Valo_tourEngine.tourGenerator;
import Valo_Server.Valo_tours.Tour;
import Valo_Server.Valo_tours.TourException;
import Valo_Server.Valo_tours.TourRepository;
import Valo_Server.Valo_user.User;
import Valo_Server.Valo_user.UserException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin(origins = "*") // Allow cross-origin requests (necessary for web clients)
public class PackageController {
    @Autowired
    private TourRepository tourRepository;

    @Autowired
    private PackageRepository packageRepository;


    @PostMapping("/packages/save/{ID}")
    public String savePackage(@RequestBody Package aPackage, @PathVariable int ID) {
        if (Token.validate(aPackage.getToken())) {
            Tour tourTemp = tourRepository.getById(ID);

            List<Package> packages = new ArrayList<>();
            Package pck = new Package(aPackage.getPackageWeight(), aPackage.getDeliveryAddress(), aPackage.getCustomerID());

            pck.setTours(tourTemp);
            packages.add(pck);
            tourTemp.setPackages(packages);
            tourRepository.save(tourTemp);

            return "{ \"Package\":\"saved\" }";
        } else {
            throw new PackageException("Invalid token");
        }
    }

    @GetMapping("/packages")
    List<Package> allpackages() {
        return packageRepository.findAll();
    }

    @GetMapping("packages/{ID}")
    Package onePackage(@PathVariable int ID) {
        return packageRepository.findById(ID)
                .orElseThrow(() -> new PackageException("\"" + ID + "\" does not exist"));
    }

}

