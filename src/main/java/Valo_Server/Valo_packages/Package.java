package Valo_Server.Valo_packages;

import Valo_Server.Valo_tours.Tour;
import com.fasterxml.jackson.annotation.JsonBackReference;

import javax.persistence.*;

@Entity
@Table(name = "packages")
public class Package {
    @Id
    @GeneratedValue
    @Column(name="packageID")
    private Integer packageID;
    @Column(name = "token")
    private String token;
    @Column(name = "weight")
    private Integer packageWeight;
    @Column(name = "delivery address")
    private String deliveryAddress;
    @ManyToOne
    @JoinColumn(name = "TourID")
    @JsonBackReference
    private Tour tour;

    public Package(Integer packageWeight, String deliveryAddress){
        this.packageWeight = packageWeight;
        this.deliveryAddress = deliveryAddress;
    }
    public Integer getPackageIDID() {
        return packageID;
    }
    public void setPackageIDID(Integer packageID) {this.packageID = packageID;}
    public String getToken() {
        return token;
    }
    public void setToken(String token) {
        this.token = token;
    }
    public Integer getPackageWeight() {
        return packageWeight;
    }
    public void setPackageWeight(Integer packageWeight) {
        this.packageWeight = packageWeight;
    }
    public String getDeliveryAddress() {return deliveryAddress;}
    public void addPackage(Integer pck){this.deliveryAddress = deliveryAddress;}

}

