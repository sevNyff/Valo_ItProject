package Valo_Server.Valo_tours;

import javax.persistence.*;
import java.util.List;
import Valo_Server.Valo_packages.Package;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "tours")
public class Tour {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="ID")
    private Integer ID;
    @Column(name = "truck")
    private Integer truckID;
    @Column(name = "time")
    private Double timeTour;
    @Column(name = "distance")
    private Double distanceTour;
    @OneToMany(fetch = FetchType.EAGER, mappedBy = "tours", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Package> packages;
    @Column(name = "token")
    private String token;

    public Tour(){}
    public Tour(int truckID){
        this.truckID = truckID;
    }
    public Integer getID() {return ID;}
    public void setID(int ID) {this.ID = ID;}
    public String getToken() {
        return token;
    }
    public void setToken(String token) {
        this.token = token;
    }
    public Integer getTruckID() {
        return truckID;
    }
    public void setTruckID(int truckID) {
        this.truckID = truckID;
    }
    public Double getTimeTour() {
        return timeTour;
    }
    public void setTimeTour(double timeTour) {
        this.timeTour = timeTour;
    }
    public Double getDistanceTour() {
        return distanceTour;
    }
    public void setDistanceTour(double distanceTour) {
        this.distanceTour = distanceTour;
    }
    public List<Package> getPackages() {return packages;}
    public void setPackages(List<Package> pck){this.packages = pck;}

    @Override
    public String toString() {
        return "Tour{" + "id=" + ID + ", truckID='" + truckID + ", time='" + timeTour + ", distance='" + distanceTour + '\'' + '}';
    }
}

