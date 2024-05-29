package UnitTest.Customer;

import Valo_Server.ServerStart;
import Valo_Server.Valo_customer.Customer;
import Valo_Server.Valo_customer.CustomerController;
import Valo_Server.Valo_customer.CustomerRepository;
import Valo_Server.Valo_helper.Token;
import Valo_Server.Valo_packages.Package;
import Valo_Server.Valo_packages.PackageRepository;
import Valo_Server.Valo_tours.Tour;
import Valo_Server.Valo_tours.TourRepository;
import Valo_Server.Valo_truck.Truck;
import Valo_Server.Valo_truck.TruckRepository;
import Valo_Server.Valo_user.User;
import Valo_Server.Valo_user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@SpringBootTest(classes = ServerStart.class)
@AutoConfigureMockMvc
public class CustomerControllerTest {
    @Autowired
    private MockMvc mvc;
    @MockBean
    private PackageRepository packageRepository;
    @MockBean
    private CustomerRepository customerRepository;
    @MockBean
    private UserRepository userRepository;
    private Token token;
    private Customer customer;

    @Test
    public void saveNewCustomerTest() throws Exception {
        User newUser = new User();
        newUser.setUserName("tester");
        newUser.setPassword("tester");
        String LoginToken = Token.generate();
        newUser.setToken(LoginToken);
        when(userRepository.save(any(User.class))).thenReturn(newUser);
        when(userRepository.findById("tester")).thenReturn(Optional.of(newUser));
        when(userRepository.findByToken(LoginToken)).thenReturn(List.of(newUser));

        Customer customer = new Customer("Hans Mustermann", "Hauptstrasse 45", "Zürich");
        customer.setToken(LoginToken);

        when(customerRepository.findById(customer.getCustomerID())).thenReturn(Optional.empty());
        when(customerRepository.save(any(Customer.class))).thenAnswer(invocation -> invocation.getArgument(0));

        String tourJson = "{ " +
                "\"token\":\"" + LoginToken + "\", " +
                "\"customerName\":\"Hans Mustermann\", " +
                "\"addressName\":\"Hauptstrasse 45\"," +
                "\"cityName\":\"Zürich\"" +
                "}";

        mvc.perform(MockMvcRequestBuilders.post("/customers/new")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(tourJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.customerName").value("Hans Mustermann"))
                .andExpect(jsonPath("$.addressName").value("Hauptstrasse 45"))
                .andExpect(jsonPath("$.cityName").value("Zürich"));

    }

    @Test
    public void deleteCustomerTest() throws Exception{
        User newUser = new User();
        newUser.setUserName("tester");
        newUser.setPassword("tester");
        String LoginToken = Token.generate();
        newUser.setToken(LoginToken);
        when(userRepository.save(any(User.class))).thenReturn(newUser);
        when(userRepository.findById("tester")).thenReturn(Optional.of(newUser));
        when(userRepository.findByToken(LoginToken)).thenReturn(List.of(newUser));

        Customer customer = new Customer("Hans Mustermann", "Hauptstrasse 45", "Zürich");
        customer.setToken(LoginToken);

        when(customerRepository.findById(1)).thenReturn(Optional.of(customer));
        when(customerRepository.save(any(Customer.class))).thenAnswer(invocation -> invocation.getArgument(0));

        mvc.perform(MockMvcRequestBuilders.get("/customers/delete/1"))
                .andExpect(status().isOk())
                .andExpect(content().json("{ \"Customer\":\"deleted\" }"));

    }
}
