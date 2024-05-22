package Valo_Server.Valo_tourEngine;

import Valo_Server.Valo_packages.Package;
import Valo_Server.Valo_tourEngine.SearchAlgorithms.TSP;
import Valo_Server.Valo_tours.Tour;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;


public class tourGenerator {
    public static Tour generateTour(Tour tour){

        List<Package> packages = tour.getPackages();
        ArrayList<String> destinations = new ArrayList<>();
        Map<String, Package> addressToPackageMap = new HashMap<>();

        for(Package pck : packages){
            String address = pck.getDeliveryAddress();
            destinations.add(address);
            addressToPackageMap.put(address, pck);
        }

        double totalDistance = 0;

        //System.out.println("Stops" + destinations);
        ArrayList<String> result = TSP.runTSP("Olten SO", destinations);
        String distance = result.get(result.size() - 1);
        totalDistance = Double.parseDouble(distance);
        result.remove(distance);

        List<Package> optimalRoutePackages = new ArrayList<>();
        for (String address : result) {
            optimalRoutePackages.add(addressToPackageMap.get(address));
        }

        // Update the tour with the optimal route packages
        tour.setPackages(optimalRoutePackages);

        double time = totalDistance / 80;  //Approximately 80 kmh on average
        time = round(time, 2);
        totalDistance = round(totalDistance, 2);

        tour.setDistanceTour(totalDistance);
        tour.setTimeTour(time);

        return tour;
    }

    public static double round(double value, int places) {
        if (places < 0) throw new IllegalArgumentException();

        BigDecimal bd = BigDecimal.valueOf(value);
        bd = bd.setScale(places, RoundingMode.HALF_UP);
        return bd.doubleValue();
    }


}
