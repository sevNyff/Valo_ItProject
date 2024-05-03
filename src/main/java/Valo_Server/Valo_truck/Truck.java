package Valo_Server.Valo_truck;

import javax.persistence.*;

@Entity
@Table(name = "truck")
public class Truck {
    @Id
    @GeneratedValue
    @Column(name="TruckID")
    private Integer TruckID;
    @Column(name = "Brand")
    private String brandName;
    @Column(name = "capacity")
    private Integer truckCapacity;
    @Column(name = "token")
    private String token;

    public Truck(String brandName, Integer truckCapacity){
        this.truckCapacity = truckCapacity;
        this.brandName = brandName;
    }
    public Integer getID() {
        return TruckID;
    }
    public void setID(int TruckID) {this.TruckID = TruckID;}
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
    public void setTruckCapacity(int truckCapacity) {this.truckCapacity = truckCapacity;}

}

