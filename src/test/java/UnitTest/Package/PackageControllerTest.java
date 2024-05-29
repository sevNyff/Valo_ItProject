package UnitTest.Package;

import Valo_Server.ServerStart;
import Valo_Server.Valo_helper.Token;
import Valo_Server.Valo_packages.Package;
import Valo_Server.Valo_packages.PackageController;
import Valo_Server.Valo_packages.PackageRepository;
import Valo_Server.Valo_tours.Tour;
import Valo_Server.Valo_tours.TourRepository;
import Valo_Server.Valo_truck.Truck;
import Valo_Server.Valo_truck.TruckRepository;
import Valo_Server.Valo_user.User;
import Valo_Server.Valo_user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
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
public class PackageControllerTest {
    @Autowired
    private MockMvc mvc;
    @MockBean
    private PackageRepository packageRepository;
    @MockBean
    private TourRepository tourRepository;
    @MockBean
    private UserRepository userRepository;
    @InjectMocks
    private PackageController packageController;
    private Token token;
    private Package aPackage;

    @Test
    public void saveNewPackageTest() throws Exception {
        User newUser = new User();
        newUser.setUserName("tester");
        newUser.setPassword("tester");
        String LoginToken = Token.generate();
        newUser.setToken(LoginToken);
        when(userRepository.save(any(User.class))).thenReturn(newUser);
        when(userRepository.findById("tester")).thenReturn(Optional.of(newUser));
        when(userRepository.findByToken(LoginToken)).thenReturn(List.of(newUser));

        Package pck = new Package(1, "Brugg AG", 1);
        pck.setToken(LoginToken);

        when(packageRepository.findById(pck.getPackageID())).thenReturn(Optional.empty());
        when(packageRepository.save(any(Package.class))).thenAnswer(invocation -> invocation.getArgument(0));

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

        when(tourRepository.getById(1)).thenReturn(tour);

        String tourJson = "{ " +
                "\"token\":\"" + LoginToken + "\", " +
                "\"packageWeight\":\"15\", " +
                "\"deliveryAddress\":\"Basel\"," +
                "\"customerID\":\"1\"" +
                "}";

        mvc.perform(MockMvcRequestBuilders.post("/packages/save/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(tourJson))
                .andExpect(status().isOk())
                .andExpect(content().json("{ \"Package\":\"saved\" }"));

    }
    @Test
    public void getOnePackageTest() throws Exception{
        User newUser = new User();
        newUser.setUserName("tester");
        newUser.setPassword("tester");
        String LoginToken = Token.generate();
        newUser.setToken(LoginToken);
        when(userRepository.save(any(User.class))).thenReturn(newUser);
        when(userRepository.findById("tester")).thenReturn(Optional.of(newUser));
        when(userRepository.findByToken(LoginToken)).thenReturn(List.of(newUser));

        Package pck = new Package(1, "Brugg AG", 1);
        pck.setToken(LoginToken);

        when(packageRepository.findById(1)).thenReturn(Optional.of(pck));

        mvc.perform(MockMvcRequestBuilders.get("/packages/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.packageWeight").value(1))
                .andExpect(jsonPath("$.deliveryAddress").value("Brugg AG"))
                .andExpect(jsonPath("$.customerID").value(1));

    }
    }
