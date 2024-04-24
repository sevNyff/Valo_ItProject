package Valo_Server.Valo_tours;

import com.fasterxml.jackson.annotation.JsonBackReference;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tours")
public class Tour {
    @Id
    @GeneratedValue
    @Column(name="tourID")
    private Integer TourID;
    @Column(name = "token")
    private String token;
    @Column(name = "truck")
    private Integer truckID;
    @OneToMany(mappedBy = "tours", fetch = FetchType.EAGER)
    @JsonBackReference
    private ArrayList<Integer> packages = new ArrayList<>();
    @Column(name = "destinations")
    private ArrayList<String> destinationNames;

    public Tour(Integer truckID, ArrayList<String> destinationNames){
        this.truckID = truckID;
        this.destinationNames = new ArrayList<>();
    }
    public Integer getTourID() {
        return TourID;
    }
    public void setTourIDID(Integer TourID) {this.TourID = TourID;}
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
    public List<Integer> getPackages() {return packages;}
    public void addPackage(Integer pck){this.packages.add(pck);}
    public List<String> getDestinationName() {return destinationNames;}
    public void addDestinationName(String destination){this.destinationNames.add(destination);}

}

