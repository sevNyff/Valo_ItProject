package UnitTest.User;

import Valo_Server.ServerStart;
import Valo_Server.Valo_helper.Token;
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
public class UserControllerTest {
    @Autowired
    private MockMvc mvc;
    @MockBean
    private User user;
    @MockBean
    private UserRepository userRepository;
    @MockBean
    private Token token;

    @Test
    public void registerUserTest() throws Exception{
        User newUser = new User();
        newUser.setUserName("tester");
        newUser.setPassword("tester");

        when(userRepository.findById("tester")).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        mvc.perform(MockMvcRequestBuilders.post("/users/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"userName\":\"tester\",\"password\":\"tester\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userName").value("tester"))
                .andExpect(jsonPath("$.password").value(""));

    }

    @Test
    public void loginUserTest() throws Exception {
        User existingUser = new User();
        existingUser.setUserName("tester");
        existingUser.setPassword("tester");

        when(userRepository.findById("tester")).thenReturn(Optional.of(existingUser));

        mvc.perform(MockMvcRequestBuilders.post("/users/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"userName\":\"tester\",\"password\":\"tester\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userName").value("tester"))
                .andExpect(jsonPath("$.password").value(""));
    }

    @Test
    public void logoutUserTest() throws Exception {
        User existingUser = new User();
        existingUser.setUserName("tester");
        existingUser.setPassword("tester");

        when(userRepository.findById("tester")).thenReturn(Optional.of(existingUser));

        mvc.perform(MockMvcRequestBuilders.post("/users/logout")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"userName\":\"tester\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userName").value("tester"));
    }
    @Test
    public void getOneUserTest() throws Exception {
        User existingUser = new User();
        existingUser.setUserName("tester");
        existingUser.setPassword("");

        when(userRepository.findById("tester")).thenReturn(Optional.of(existingUser));

        mvc.perform(MockMvcRequestBuilders.get("/users/tester"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userName").value("tester"))
                .andExpect(jsonPath("$.password").value(""));
    }

    @Test
    public void testPing() throws Exception {
        mvc.perform(MockMvcRequestBuilders.get("/ping"))
                .andExpect(status().isOk())
                .andExpect(content().json("{ \"ping\":\"success\" }"));
    }
}
