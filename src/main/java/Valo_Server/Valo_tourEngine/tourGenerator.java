package Valo_Server.Valo_tourEngine;

import Valo_Server.Valo_packages.Package;
import Valo_Server.Valo_tourEngine.SearchAlgorithms.AStar;
import Valo_Server.Valo_tours.Tour;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

import static java.lang.Math.round;


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


        double totalDistance = 0;

        for(int i = 0;i < packages.size() - 1; i++){
            totalDistance += AStar.runAStar(destinations[i],destinations[i + 1]);
        }
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
