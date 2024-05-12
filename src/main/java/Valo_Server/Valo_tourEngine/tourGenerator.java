package Valo_Server.Valo_tourEngine;

import Valo_Server.Valo_packages.Package;
import Valo_Server.Valo_tourEngine.SearchAlgorithms.AStar;
import Valo_Server.Valo_tours.Tour;

import java.util.List;



public class tourGenerator {
    public static Tour generateTour(Tour tour){

        int counter = 0;

        List<Package> packages = tour.getPackages();
        String[] destinations = new String[20];

        for(Package pck : packages){
            String address = pck.getDeliveryAddress();
            destinations[counter] = address;
            counter++;
        }
        //System.out.println("Destinations:   " + Arrays.toString(destinations));


        double totalDistance = 0;

        for(int i = 0;i < packages.size() - 1; i++){
            totalDistance += AStar.runAStar(destinations[i],destinations[i + 1]);
        }
        //System.out.println("Distance: " + totalDistance);

        tour.setDistanceTour(totalDistance);
        tour.setTimeTour(totalDistance / 80);

        return tour;
    }


}
