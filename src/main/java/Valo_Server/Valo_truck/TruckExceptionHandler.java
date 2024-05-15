package Valo_Server.Valo_truck;

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
public class TruckExceptionHandler {

    private static final Logger LOG = LoggerFactory.getLogger(UserExceptionHandler.class);

    @ExceptionHandler(value = {TruckException.class})
    @ResponseBody
    ResponseEntity<ErrorResponse> truckError(TruckException ex) {
        LOG.error("Truck exception " , ex);
        ErrorResponse response = new ErrorResponse("Truck error", ex.getMessage());
        return new ResponseEntity<ErrorResponse>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
