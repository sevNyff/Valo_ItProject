package Valo_Server.Valo_tourEngine.SearchAlgorithms;

import java.util.ArrayList;
import java.util.Map;
import java.util.Scanner;

public class AStar {

    /**
     * We use an inner class "Path" because our paths not only contain a list of nodes visited,
     * and also a heuristic value: how close is the last node to the final goal?
     */
    private record Path(ArrayList<String> nodes, double distanceSoFar, long distanceToGoal, double totalDistance) {};

    private static Map<String, ArrayList<MapData.Destination>> adjList;
    private static Map<String, MapData.GPS> nodeList;


    public static double runAStar(String start, String end){

        //System.out.println(start + end);

        double timeBefore = System.nanoTime();
        MapData data = null;
        try {
            data = new MapData();
        } catch (Exception e) {
            System.out.println("Error reading map data");
        }
        adjList = data.getAdjacencyList();
        nodeList = data.getNodes();
        //Get the user inputs and put them into an array

        Path path = aStar(start, end);
        //printPath(path);

        return path.totalDistance;

    }

    private static void printPath(Path path) {
        ArrayList<String> nodes = path.nodes;
        //System.out.print("Final solution: ");
        for (String node : nodes) System.out.printf("%s ", node);
        //System.out.println();

        System.out.print("Total distance: ");
        System.out.printf("%.1f", path.totalDistance);
        System.out.print("m");
        System.out.println();
    }

    private static Path aStar(String start, String end) {
        ArrayList<Path> paths = new ArrayList<>();
        ArrayList<String> startingNodeList = new ArrayList<>();
        startingNodeList.add(start);
        long startingDistance = distanceBetween(start, end);
        paths.add(new Path(startingNodeList, 0, startingDistance, startingDistance)); // Add starting path to list

        while (paths.size() > 0) {
            // Find the path whose end-node is closest to our goal
            // Remove this path from the list, and use it for the next step
            int bestIndex = bestPath(paths, end);
            Path oldPath = paths.remove(bestIndex);
            if (isSolution(oldPath, end)) return oldPath; // Best solution!!

            // Extend it in all possible ways, adding each new path to the end of the list
            // Omit any paths that would re-visit an old node
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

    /**
     * We assume that the list of paths is not empty. Find the path whose end-node is
     * closest to the goal
     */
    private static int bestPath(ArrayList<Path> paths, String goal) {
        int bestPath = 0;
        double smallestDistance = paths.get(0).distanceSoFar + paths.get(0).distanceToGoal;

        for (int i = 1; i < paths.size(); i++) {

            double distanceThisPath = paths.get(i).distanceSoFar + paths.get(i).distanceToGoal;
            if (distanceThisPath < smallestDistance) {
                bestPath = i;


                smallestDistance = distanceThisPath;

                //bestDist = paths.get(i).distanceSoFar;
                //distanceSum.add(bestDist);
            }
        }
        return bestPath;
    }

    /**
     * Return the distance between the end-node of the path and the stated goal.
     * We calculate X*X + Y*Y, but we do not bother with the square root. Why?
     * Because calculating the square-root is slow, and doesn't change anything
     * for this heuristic. So we really return the *square* of the distance.
     */
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
            System.out.println("NullPointerException caught");
        }
        return distance;



        /*          Alt
        MapData.GPS lastPos = nodeList.get(node);
        MapData.GPS goalPos = nodeList.get(goal);
        long xDiff = lastPos.east() - goalPos.east();
        long yDiff = lastPos.north() - goalPos.north();
        return xDiff * xDiff + yDiff * yDiff;
        */
    }

    static String[] userInput(){

        Scanner in = new Scanner(System.in);
        System.out.println("Where are you?");
        String startInput = in.nextLine();
        System.out.println("Where do you want to go?");
        String endInput = in.nextLine();
        in.close();
        String[] returnStringArray = {startInput, endInput};
        return returnStringArray;
        //End User Interaction
    }
}
