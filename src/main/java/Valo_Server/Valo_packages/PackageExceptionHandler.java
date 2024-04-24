package Valo_Server.Valo_packages;

import Valo_Server.Valo_helper.ErrorResponse;
import Valo_Server.Valo_user.UserExceptionHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

@ControllerAdvice
public class PackageExceptionHandler {

    private static final Logger LOG = LoggerFactory.getLogger(UserExceptionHandler.class);

    @ExceptionHandler(value = {PackageException.class})
    @ResponseBody
    ResponseEntity<ErrorResponse> gameError(PackageException ex) {
        LOG.error("Game exception " , ex);
        ErrorResponse response = new ErrorResponse("Game error", ex.getMessage());
        return new ResponseEntity<ErrorResponse>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
