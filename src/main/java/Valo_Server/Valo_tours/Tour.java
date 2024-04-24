package Valo_Server.Valo_tours;

import com.fasterxml.jackson.annotation.JsonBackReference;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;
import Valo_Server.Valo_packages.Package;

@Entity
@Table(name = "tours")
public class Tour {
    @Id
    @GeneratedValue
    @Column(name="ID")
    private Integer ID;
    @Column(name = "token")
    private String token;
    @Column(name = "truck")
    private Integer truckID;
    @OneToMany(mappedBy = "tours", fetch = FetchType.EAGER)
    @JsonBackReference
    private List<Package> packages;

    //@Column(name = "destinations")
    //private ArrayList<String> destinationNames;

    public Tour(Integer truckID, List<Package> packages){
        this.truckID = truckID;
        this.packages = new ArrayList<>();
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
    public Integer getTruckID() {
        return truckID;
    }
    public void setTruckID(Integer truckID) {
        this.truckID = truckID;
    }
    public List<Package> getPackages() {return packages;}
    public void addPackage(Package pck){this.packages.add(pck);}
    /*public List<String> getDestinationName() {return destinationNames;}
    public void addDestinationName(String destination){this.destinationNames.add(destination);}
*/
}

