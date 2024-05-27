package UnitTest.Truck;


import Valo_Server.ServerStart;
import Valo_Server.Valo_helper.Token;
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

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(classes = ServerStart.class)
@AutoConfigureMockMvc
public class TruckControllerTest {
    @Autowired
    private MockMvc mvc;
    @MockBean
    private Truck truck;
    @MockBean
    private TruckRepository truckRepository;
    @MockBean
    private Token token;

    @Test
    public void registerUserTest() throws Exception{

    }
}
