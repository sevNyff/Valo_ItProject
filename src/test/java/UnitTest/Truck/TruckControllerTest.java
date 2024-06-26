package UnitTest.Truck;


import Valo_Server.ServerStart;
import Valo_Server.Valo_helper.Token;
import Valo_Server.Valo_tours.Tour;
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

import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@SpringBootTest(classes = ServerStart.class)
@AutoConfigureMockMvc
public class TruckControllerTest {
    @Autowired
    private MockMvc mvc;
    @MockBean
    private TruckRepository truckRepository;
    @MockBean
    private UserRepository userRepository;
    private Token token;
    private Truck truck;

    @Test
    public void newTruckTest() throws Exception{
        User newUser = new User();
        newUser.setUserName("tester");
        newUser.setPassword("tester");
        String LoginToken = Token.generate();
        newUser.setToken(LoginToken);
        System.out.println("Token:" + LoginToken);
        when(userRepository.save(any(User.class))).thenReturn(newUser);
        when(userRepository.findById("tester")).thenReturn(Optional.of(newUser));
        when(userRepository.findByToken(LoginToken)).thenReturn(List.of(newUser));

        Truck newTruck = new Truck("BMW", 15);
        newTruck.setToken(LoginToken);

        when(truckRepository.findById(newTruck.getID())).thenReturn(Optional.empty());
        when(truckRepository.save(any(Truck.class))).thenAnswer(invocation -> invocation.getArgument(0));

        String tourJson = "{ " +
                "\"token\":\"" + LoginToken + "\", " +
                "\"truckCapacity\":\"15\", " +
                "\"brandName\":\"BMW\"" +
                "}";

        mvc.perform(MockMvcRequestBuilders.post("/trucks/new")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(tourJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.brandName").value("BMW"))
                .andExpect(jsonPath("$.truckCapacity").value("15"));

    }
    @Test
    public void deleteOneTruckTest() throws Exception{
        User newUser = new User();
        newUser.setUserName("tester");
        newUser.setPassword("tester");
        String LoginToken = Token.generate();
        newUser.setToken(LoginToken);
        when(userRepository.save(any(User.class))).thenReturn(newUser);
        when(userRepository.findById("tester")).thenReturn(Optional.of(newUser));
        when(userRepository.findByToken(LoginToken)).thenReturn(List.of(newUser));

        Truck newTruck = new Truck("BMW", 15);
        newTruck.setToken(LoginToken);

        when(truckRepository.findById(1)).thenReturn(Optional.of(newTruck));
        when(truckRepository.save(any(Truck.class))).thenAnswer(invocation -> invocation.getArgument(0));

        mvc.perform(MockMvcRequestBuilders.get("/trucks/delete/1"))
                .andExpect(status().isOk())
                .andExpect(content().json("{ \"truck\":\"deleted\" }"));

    }
    @Test
    public void getOneTruckTest() throws Exception{
        User newUser = new User();
        newUser.setUserName("tester");
        newUser.setPassword("tester");
        String LoginToken = Token.generate();
        newUser.setToken(LoginToken);
        when(userRepository.save(any(User.class))).thenReturn(newUser);
        when(userRepository.findById("tester")).thenReturn(Optional.of(newUser));
        when(userRepository.findByToken(LoginToken)).thenReturn(List.of(newUser));

        Truck newTruck = new Truck("BMW", 15);
        newTruck.setToken(LoginToken);

        when(truckRepository.findById(5)).thenReturn(Optional.of(newTruck));

        mvc.perform(MockMvcRequestBuilders.get("/trucks/5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.brandName").value("BMW"))
                .andExpect(jsonPath("$.truckCapacity").value(15));

    }
}
