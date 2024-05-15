package Valo_Server.Valo_customer;

import Valo_Server.Valo_helper.ErrorResponse;
import Valo_Server.Valo_truck.TruckException;
import Valo_Server.Valo_user.UserExceptionHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

public class CustomerExceptionHandler {
    private static final Logger LOG = LoggerFactory.getLogger(UserExceptionHandler.class);

    @ExceptionHandler(value = {CustomerException.class})
    @ResponseBody
    ResponseEntity<ErrorResponse> gameError(TruckException ex) {
        LOG.error("Customer exception " , ex);
        ErrorResponse response = new ErrorResponse("Customer error", ex.getMessage());
        return new ResponseEntity<ErrorResponse>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
