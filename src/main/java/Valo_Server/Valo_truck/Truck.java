package Valo_Server.Valo_truck;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tours")
public class Truck {
    @Id
    @GeneratedValue
    @Column(name="TruckID")
    private Integer TruckID;
    @Column(name = "token")
    private String token;
    @Column(name = "Brand")
    private String brandName;
    @Column(name = "capacity")
    private Integer truckCapacity;

    public Truck(String brandName, Integer truckCapacity){
        this.brandName = brandName;
        this.truckCapacity = truckCapacity;
    }
    public Integer getID() {
        return TruckID;
    }
    public void setID(Integer TruckID) {this.TruckID = TruckID;}
    public String getToken() {
        return token;
    }
    public void setToken(String token) {
        this.token = token;
    }
    public String getBrandName() {
        return brandName;
    }
    public void setBrandName(String truckName) {
        this.brandName = brandName;
    }
    public Integer getTruckCapacity() {
        return truckCapacity;
    }
    public void setTruckCapacity(Integer truckCapacity) {this.truckCapacity = truckCapacity;}

}

