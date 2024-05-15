package Valo_Server.Valo_tours;

import Valo_Server.Valo_helper.ErrorResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import Valo_Server.Valo_user.UserExceptionHandler;

@ControllerAdvice
public class TourExceptionHandler {

    private static final Logger LOG = LoggerFactory.getLogger(UserExceptionHandler.class);

    @ExceptionHandler(value = {TourException.class})
    @ResponseBody
    ResponseEntity<ErrorResponse> tourError(TourException ex) {
        LOG.error("Tour exception " , ex);
        ErrorResponse response = new ErrorResponse("Tour error", ex.getMessage());
        return new ResponseEntity<ErrorResponse>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
