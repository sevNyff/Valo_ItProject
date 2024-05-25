package Valo_Server.Valo_tourEngine.SearchAlgorithms;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Scanner;

public class TSP {

    private record Path(ArrayList<String> nodes, double distanceSoFar, long distanceToGoal, double totalDistance) {};

    private static Map<String, ArrayList<MapData.Destination>> adjList;
    private static Map<String, MapData.GPS> nodeList;

    public static ArrayList<String> runTSP(String start, ArrayList<String> stops) {
        ArrayList<String> result = new ArrayList<>();
        MapData data = null;
        try {
            data = new MapData();
        } catch (Exception e) {
            System.out.println("Error reading map data");
        }
        adjList = data.getAdjacencyList();
        nodeList = data.getNodes();

        ArrayList<String> orderedStops = findBestTour(start, stops);
        //System.out.println("Orderedstops: " + orderedStops);

        double totalDistance = 0;
        String currentNode = start;

            for (String stop : orderedStops) {
                Path path = AStar(currentNode, stop);
                if (path == null) {
                    System.out.println("No path found from " + currentNode + " to " + stop);
                    return result;
                }
                //printPath(path);
                totalDistance += path.totalDistance;
                currentNode = stop;
            }
            result = orderedStops;
            String str = Double.toString(totalDistance);
            result.add(str);

        return result;
    }

    private static List<String> printPath(Path path) {
        ArrayList<String> nodes = path.nodes;
        System.out.print("Final solution: ");
        for (String node : nodes) System.out.printf("%s ", node);
        System.out.println();

        System.out.print("Total distance: ");
        System.out.printf("%.1f", path.totalDistance);
        System.out.print("m");
        System.out.println();

        return nodes;
    }

    private static Path AStar(String start, String end) {
        ArrayList<Path> paths = new ArrayList<>();
        ArrayList<String> startingNodeList = new ArrayList<>();
        startingNodeList.add(start);
        long startingDistance = distanceBetween(start, end);
        paths.add(new Path(startingNodeList, 0, startingDistance, startingDistance)); // Add starting path to list

        while (paths.size() > 0) {
            int bestIndex = bestPath(paths, end);
            Path oldPath = paths.remove(bestIndex);
            if (isSolution(oldPath, end)) return oldPath;

            ArrayList<String> oldNodes = oldPath.nodes;
            String lastNode = oldNodes.get(oldNodes.size() - 1);
            ArrayList<MapData.Destination> connectedNodes = adjList.get(lastNode);
            for (MapData.Destination d : connectedNodes) {
                if (!oldNodes.contains(d.node())) {
                    ArrayList<String> newNodes = (ArrayList<String>) oldNodes.clone();
                    newNodes.add(d.node());
                    double newDistanceSoFar = oldPath.distanceSoFar + d.distance();
                    double totalDistance = newDistanceSoFar + distanceBetween(d.node(), end);
                    paths.add(new Path(newNodes, newDistanceSoFar, distanceBetween(d.node(), end), totalDistance));
                }
            }
        }
        return null; // No solution found
    }

    private static boolean isSolution(Path path, String goal) {
        ArrayList<String> pathNodes = path.nodes;
        return (pathNodes.get(pathNodes.size()-1).equals(goal));
    }

    private static int bestPath(ArrayList<Path> paths, String goal) {
        int bestPath = 0;
        double smallestDistance = paths.get(0).totalDistance;

        for (int i = 1; i < paths.size(); i++) {
            double distanceThisPath = paths.get(i).totalDistance;
            if (distanceThisPath < smallestDistance) {
                bestPath = i;
                smallestDistance = distanceThisPath;
            }
        }
        return bestPath;
    }

    static long distanceBetween(String node, String goal) {
        MapData.GPS lastPos = nodeList.get(node);
        MapData.GPS goalPos = nodeList.get(goal);
        long xDiff = 0;
        long yDiff = 0;

        long distance = 0;

        try {
            xDiff = lastPos.east() - goalPos.east();
            yDiff = lastPos.north() - goalPos.north();
            distance = xDiff * xDiff + yDiff * yDiff;
        }catch(NullPointerException e){
            //System.out.println("NullPointerException caught");
        }
        return distance;
    }

    private static ArrayList<String> findBestTour(String start, ArrayList<String> stops) {
        ArrayList<String> bestTour = new ArrayList<>();
        double bestDistance = Double.MAX_VALUE;
        ArrayList<ArrayList<String>> permutations = generatePermutations(stops);

        for (ArrayList<String> tour : permutations) {
            tour.add(0, start); // Add start to the beginning
            //tour.add(start); // Add start to the end to complete the tour
            double distance = calculateTourDistance(tour);
            if (distance < bestDistance) {
                bestDistance = distance;
                bestTour = new ArrayList<>(tour);
            }
        }
        return bestTour;
    }
    private static double calculateTourDistance(ArrayList<String> tour) {
        double totalDistance = 0;
        for (int i = 0; i < tour.size() - 1; i++) {
            totalDistance += distanceBetween(tour.get(i), tour.get(i + 1));
        }
        return totalDistance;
    }

    private static ArrayList<ArrayList<String>> generatePermutations(ArrayList<String> list) {
        ArrayList<ArrayList<String>> result = new ArrayList<>();
        if (list.size() == 0) {
            result.add(new ArrayList<>());
            return result;
        }
        String firstElement = list.remove(0);
        ArrayList<ArrayList<String>> recursiveReturn = generatePermutations(list);
        for (ArrayList<String> li : recursiveReturn) {
            for (int index = 0; index <= li.size(); index++) {
                ArrayList<String> temp = new ArrayList<>(li);
                temp.add(index, firstElement);
                result.add(temp);
            }
        }
        list.add(0, firstElement);
        return result;
    }
}

