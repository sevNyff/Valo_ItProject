package Valo_Server.Valo_helper;


import java.util.List;

import Valo_Server.Valo_user.User;
import Valo_Server.Valo_user.UserController;
import Valo_Server.Valo_user.UserRepository;

/**
 * A class that provides Server.helper functions for dealing with tokens
 */
public class Token {

    /**
     * Create a token. A token is just a large, secret number.
     */
    public static String generate() {
        long tokenAsLong = (long) (Math.random() * Long.MAX_VALUE);
        return Long.toHexString(tokenAsLong);
    }

    public static boolean validate(String token) {
        boolean valid = false;
        UserRepository repository = UserController.getRepository();
        try {
            Long.parseLong(token, 16);

            List<User> users = repository.findByToken(token); // Should be only one
            valid = (users.size() > 0);

        } catch (NumberFormatException e) {
        }
        return valid;
    }
}
