package Valo_Server.Valo_user;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

import Valo_Server.Valo_helper.ErrorResponse;

/**
 * What to do when the Server.user sends an invalid request, generating a UserException?
 *
 * When working with Android and the Retrofit library, any sort of error status
 * generates an exception, which is difficult to catch. For this reason, we turn
 * a UserException into a status 200 (OK), but with an error message.
 */
@ControllerAdvice
public class UserExceptionHandler {

    private static final Logger LOG = LoggerFactory.getLogger(UserExceptionHandler.class);

    @ExceptionHandler(value = {UserException.class})
    @ResponseBody
    ResponseEntity<ErrorResponse> userError(UserException ex) {
        LOG.error("User exception " , ex);
        ErrorResponse response = new ErrorResponse("User error", ex.getMessage());
        return new ResponseEntity<ErrorResponse>(response, HttpStatus.OK);
    }


}
