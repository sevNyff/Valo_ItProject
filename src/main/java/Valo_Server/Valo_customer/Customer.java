package Valo_Server.Valo_customer;

import javax.persistence.*;
import Valo_Server.Valo_packages.Package;
import Valo_Server.Valo_tours.Tour;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "customer")
public class Customer {
    @Id
    @GeneratedValue
    @Column(name= "CustomerID")
    private Integer CustomerID;
    @Column(name = "Name")
    private String customerName;
    @Column(name = "Address")
    private String addressName;
    @Column(name = "City")
    private String cityName;
    private String token;
    public Customer() {}
    public Customer(String customerName, String addressName, String cityName){
        this.customerName = customerName;
        this.addressName = addressName;
        this.cityName = cityName;
    }
    public Integer getCustomerID() {
        return CustomerID;
    }
    public void setCustomerID(int CustomerID) {this.CustomerID = CustomerID;}
    public String getToken() {
        return token;
    }
    public void setToken(String token) {
        this.token = token;
    }
    public String getCustomerName() {
        return customerName;
    }
    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }
    public String getAddressName() {
        return addressName;
    }
    public void setAddressName(String addressName) {
        this.addressName = addressName;
    }
    public String getCityName() {
        return cityName;
    }
    public void setCityName(String cityName) {this.cityName = cityName;}

    @Override
    public String toString(){ return "Customer: " + this.CustomerID + " | "+ this.customerName+ this.CustomerID + " | "+ this.addressName + " | " + this.cityName;}

}


