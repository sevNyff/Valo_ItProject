package Valo_Server.Valo_tourEngine;

import Valo_Server.Valo_packages.Package;
import Valo_Server.Valo_tourEngine.SearchAlgorithms.TSP;
import Valo_Server.Valo_tours.Tour;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class tourGenerator {
    public static Tour generateTour(Tour tour) {
        List<Package> packages = tour.getPackages();
        ArrayList<String> destinations = new ArrayList<>();
        Map<String, List<Package>> addressToPackageMap = new HashMap<>();

        for (Package pck : packages) {
            String address = pck.getDeliveryAddress();
            destinations.add(address);
            addressToPackageMap.computeIfAbsent(address, k -> new ArrayList<>()).add(pck); //Falls Abladestation noch nicht existiert, dann eine neue List erstellen.
        }

        System.out.println("Stops: " + destinations);
        ArrayList<String> result = TSP.runTSP("Olten SO", destinations); //Startpunkt unserer Tour ist immer Olten.
        String distance = result.get(result.size() - 1);
        double totalDistance = Double.parseDouble(distance);
        result.remove(distance);

        List<Package> optimalRoutePackages = new ArrayList<>();
        for (String address : result) {
            List<Package> packageList = addressToPackageMap.get(address);
            if (packageList != null && !packageList.isEmpty()) {
                optimalRoutePackages.add(packageList.remove(0));
            }
        }

        tour.setPackages(optimalRoutePackages);

        double time = totalDistance / 80;  // Approximately 80 km/h on average
        time = round(time, 2);
        totalDistance = round(totalDistance, 2);

        tour.setDistanceTour(totalDistance);
        tour.setTimeTour(time);

        return tour;
    }

    /**
     * This method is copied from Stack overflow:
     * https://stackoverflow.com/questions/2808535/round-a-double-to-2-decimal-places
     */

    public static double round(double value, int places) {
        if (places < 0) throw new IllegalArgumentException();

        BigDecimal bd = BigDecimal.valueOf(value);
        bd = bd.setScale(places, RoundingMode.HALF_UP);
        return bd.doubleValue();
    }
}
