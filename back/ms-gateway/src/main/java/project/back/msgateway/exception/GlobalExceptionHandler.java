package project.back.msgateway.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.reactive.resource.NoResourceFoundException;
import org.springframework.web.server.ResponseStatusException;

import project.back.msgateway.response.generic.ErrorPayload;

@ControllerAdvice
public class GlobalExceptionHandler {
  @ExceptionHandler({NoResourceFoundException.class})
  public ResponseEntity<?> handleNoResourceFoundException(NoResourceFoundException ex) {
    return new ResponseEntity<ErrorPayload>(new ErrorPayload("Resource not found"), HttpStatus.NOT_FOUND);
  }

  @ExceptionHandler({ResponseException.class})
  public ResponseEntity<?> handleResponseException(ResponseException ex) {
    return new ResponseEntity<ErrorPayload>(new ErrorPayload(ex.getMessage()), ex.getStatusCode());
  }

  @ExceptionHandler({ResponseStatusException.class})
  public ResponseEntity<?> ResponseStatusException(ResponseStatusException ex) {
    return new ResponseEntity<ErrorPayload>(new ErrorPayload("Sorry our service is currently down"), HttpStatus.INTERNAL_SERVER_ERROR);
  }

  @ExceptionHandler({Exception.class})
  public ResponseEntity<?> handleException(Exception ex) {
    return new ResponseEntity<ErrorPayload>(new ErrorPayload(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
