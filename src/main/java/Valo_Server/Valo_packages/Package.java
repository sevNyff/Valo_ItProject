package Valo_Server.Valo_packages;

import Valo_Server.Valo_customer.Customer;
import Valo_Server.Valo_tours.Tour;
import com.fasterxml.jackson.annotation.JsonBackReference;

import javax.persistence.*;

@Entity
@Table(name = "packages")
public class Package {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="packageID")
    private Integer packageID;
    @Column(name = "weight")
    private Integer packageWeight;
    @Column(name = "delivery_address")
    private String deliveryAddress;
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "tourID")
    @JsonBackReference
    private Tour tours;
    private String token;

    public Package(){}
    public Package(int packageWeight, String deliveryAddress){
        this.packageWeight = packageWeight;
        this.deliveryAddress = deliveryAddress;
    }
    public Integer getPackageID() {
        return packageID;
    }
    public void setPackageIDID(int packageID) {this.packageID = packageID;}
    public String getToken() {
        return token;
    }
    public void setToken(String token) {
        this.token = token;
    }
    public Integer getPackageWeight() {
        return packageWeight;
    }
    public void setPackageWeight(int packageWeight) {
        this.packageWeight = packageWeight;
    }
    public String getDeliveryAddress() {return deliveryAddress;}
    public void setDeliveryAddress(String deliveryAddress){this.deliveryAddress = deliveryAddress;}
    public Tour getTours() {return tours; }
    public void setTours(Tour tours){this.tours = tours;}

    @Override
    public String toString() {
        return "Package{" + "id=" + packageID + ", weight='" + packageWeight + '\'' + ", delivery address='" + deliveryAddress + '\'' + '}';
    }

}

