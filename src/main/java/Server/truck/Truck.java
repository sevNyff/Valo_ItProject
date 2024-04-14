package Server.truck;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "trucks")
public class Truck {
    @Id
    @GeneratedValue
    @Column(name="ID")
    private Integer ID;
    @Column(name = "token")
    private String token;
    @Column(name = "truck")
    private String truckName;
    @Column(name = "capacity")
    private Integer truckCapacity;
    @Column(name = "packages")
    private ArrayList<Integer> packages = new ArrayList<>();
    @Column(name = "destinations")
    private ArrayList<String> destinationName = new ArrayList<>();

    public Truck(){
    }
    public Integer getID() {
        return ID;
    }
    public void setID(Integer ID) {this.ID = ID;}
    public String getToken() {
        return token;
    }
    public void setToken(String token) {
        this.token = token;
    }
    public String getTruckName() {
        return truckName;
    }
    public void setTruckName(String truckName) {
        this.truckName = truckName;
    }
    public Integer getTruckCapacity() {
        return truckCapacity;
    }
    public void setTruckCapacity(Integer truckCapacity) {this.truckCapacity = truckCapacity;}
    public List<Integer> getPackages() {return packages;}
    public void addPackage(Integer pck){this.packages.add(pck);}
    public List<String> getDestinationName() {return destinationName;}
    public void addPackage(String destination){this.destinationName.add(destination);}

}

