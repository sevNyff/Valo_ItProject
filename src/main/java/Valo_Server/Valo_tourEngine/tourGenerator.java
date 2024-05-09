package Valo_Server.Valo_tourEngine;

import Valo_Server.Valo_packages.Package;
import Valo_Server.Valo_tours.Tour;

import java.util.ArrayList;
import java.util.List;



public class tourGenerator {
    public static Tour generateTour(Tour tour){

        List<Package> packages = tour.getPackages();
        ArrayList<String> destinations = new ArrayList<>();

        for(Package pck : packages){
            String address = pck.getDeliveryAddress();
            destinations.add(address);
        }

        return tour;
    }


}
