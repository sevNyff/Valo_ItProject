package UnitTest.Tour;


import Valo_Server.ServerStart;
import Valo_Server.Valo_helper.Token;
import Valo_Server.Valo_packages.Package;
import Valo_Server.Valo_tours.Tour;
import Valo_Server.Valo_tours.TourRepository;
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

@SpringBootTest(classes = ServerStart.class)
@AutoConfigureMockMvc
public class TourControllerTest {
    @Autowired
    private MockMvc mvc;
    private Tour tour;
    @MockBean
    private TourRepository tourRepository;
    @MockBean
    private UserRepository userRepository;
    private Token token;

    @BeforeEach
    public void setup(){

    }

    @Test
    public void saveTourTest() throws Exception{
        User newUser = new User();
        newUser.setUserName("tester");
        newUser.setPassword("tester");
        String LoginToken = Token.generate();
        newUser.setToken(LoginToken);
        when(userRepository.save(any(User.class))).thenReturn(newUser);
        when(userRepository.findById("tester")).thenReturn(Optional.of(newUser));
        when(userRepository.findByToken(LoginToken)).thenReturn(List.of(newUser));

        Tour tour = new Tour(1);
        tour.setToken(LoginToken);

        Package package1 = new Package(1, "Brugg AG", 3);
        Package package2 = new Package(1, "Bern", 3);
        Package package3 = new Package(1, "Zürich", 3);
        List<Package> packages = new ArrayList<>();
        packages.add(package1);
        packages.add(package2);
        packages.add(package3);
        tour.setPackages(packages);

        when(tourRepository.findById(tour.getID())).thenReturn(Optional.empty());
        when(tourRepository.save(any(Tour.class))).thenAnswer(invocation -> invocation.getArgument(0));

        String tourJson = "{ " +
                "\"token\":\"" + LoginToken + "\", " +
                "\"truckID\":\"2\", " +
                "\"packages\":[" +
                "{\"packageWeight\":\"1\",\"deliveryAddress\":\"Brugg AG\",\"customerID\":\"3\"}," +
                "{\"packageWeight\":\"1\",\"deliveryAddress\":\"Bern\",\"customerID\":\"3\"}," +
                "{\"packageWeight\":\"1\",\"deliveryAddress\":\"Zürich\",\"customerID\":\"3\"}" +
                "]" +
                "}";

        mvc.perform(MockMvcRequestBuilders.post("/tours/save")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(tourJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.truckID").value(2))
                .andExpect(jsonPath("$.packages[0].packageWeight").value(1))
                .andExpect(jsonPath("$.packages[0].deliveryAddress").value("Zürich"))
                .andExpect(jsonPath("$.packages[0].customerID").value(3))
                .andExpect(jsonPath("$.packages[1].packageWeight").value(1))
                .andExpect(jsonPath("$.packages[1].deliveryAddress").value("Brugg AG"))
                .andExpect(jsonPath("$.packages[1].customerID").value(3))
                .andExpect(jsonPath("$.packages[2].packageWeight").value(1))
                .andExpect(jsonPath("$.packages[2].deliveryAddress").value("Bern"))
                .andExpect(jsonPath("$.packages[2].customerID").value(3));
    }

    @Test
    public void deleteTourTest() throws Exception{
        User newUser = new User();
        newUser.setUserName("tester");
        newUser.setPassword("tester");
        String LoginToken = Token.generate();
        newUser.setToken(LoginToken);
        when(userRepository.save(any(User.class))).thenReturn(newUser);
        when(userRepository.findById("tester")).thenReturn(Optional.of(newUser));
        when(userRepository.findByToken(LoginToken)).thenReturn(List.of(newUser));

        Tour tour = new Tour(1);
        tour.setToken(LoginToken);

        Package package1 = new Package(1, "Brugg AG", 3);
        Package package2 = new Package(1, "Bern", 3);
        Package package3 = new Package(1, "Zürich", 3);
        List<Package> packages = new ArrayList<>();
        packages.add(package1);
        packages.add(package2);
        packages.add(package3);
        tour.setPackages(packages);

        when(tourRepository.findById(tour.getID())).thenReturn(Optional.empty());
        when(tourRepository.save(any(Tour.class))).thenAnswer(invocation -> invocation.getArgument(0));

        String tourJson = "{ " +
                "\"token\":\"" + LoginToken + "\", " +
                "\"truckID\":\"1\", " +
                "\"packages\":[" +
                "{\"packageWeight\":\"1\",\"deliveryAddress\":\"Brugg AG\",\"customerID\":\"3\"}," +
                "{\"packageWeight\":\"1\",\"deliveryAddress\":\"Bern\",\"customerID\":\"3\"}," +
                "{\"packageWeight\":\"1\",\"deliveryAddress\":\"Zürich\",\"customerID\":\"3\"}" +
                "]" +
                "}";

        mvc.perform(MockMvcRequestBuilders.post("/tours/quit")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(tourJson))
                .andExpect(status().isOk())
                .andExpect(content().json("{ \"tour\":\"deleted\" }"));
    }

    @Test
    public void getOneTourTest() throws Exception {
        User newUser = new User();
        newUser.setUserName("tester");
        newUser.setPassword("tester");
        String loginToken = Token.generate();
        newUser.setToken(loginToken);

        when(userRepository.save(any(User.class))).thenReturn(newUser);
        when(userRepository.findById("tester")).thenReturn(Optional.of(newUser));
        when(userRepository.findByToken(loginToken)).thenReturn(List.of(newUser));

        Tour tour = new Tour(1);
        tour.setToken(loginToken);
        Package package1 = new Package(1, "Brugg AG", 3);
        Package package2 = new Package(2, "Bern", 3);
        Package package3 = new Package(3, "Zürich", 3);
        List<Package> packages = new ArrayList<>();
        packages.add(package1);
        packages.add(package2);
        packages.add(package3);
        tour.setPackages(packages);

        when(tourRepository.findById(1)).thenReturn(Optional.of(tour));

        mvc.perform(MockMvcRequestBuilders.get("/tours/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.truckID").value(1))
                .andExpect(jsonPath("$.packages[0].packageWeight").value(1))
                .andExpect(jsonPath("$.packages[0].deliveryAddress").value("Brugg AG"))
                .andExpect(jsonPath("$.packages[0].customerID").value(3))
                .andExpect(jsonPath("$.packages[1].packageWeight").value(2))
                .andExpect(jsonPath("$.packages[1].deliveryAddress").value("Bern"))
                .andExpect(jsonPath("$.packages[1].customerID").value(3))
                .andExpect(jsonPath("$.packages[2].packageWeight").value(3))
                .andExpect(jsonPath("$.packages[2].deliveryAddress").value("Zürich"))
                .andExpect(jsonPath("$.packages[2].customerID").value(3));
    }



}
