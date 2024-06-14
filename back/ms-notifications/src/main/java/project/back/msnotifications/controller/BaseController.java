package project.back.msnotifications.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.RestController;

import project.back.msnotifications.response.generic.ErrorPayload;
import project.back.msnotifications.response.generic.SuccessPayload;

@RestController
public class BaseController {

  protected ResponseEntity<SuccessPayload> sendSuccessResponse(String message) {
    return new ResponseEntity<SuccessPayload>(new SuccessPayload(message), HttpStatus.OK);
  }
  protected ResponseEntity<SuccessPayload> sendSuccessResponse(String message, @NonNull HttpStatus status) {
    return new ResponseEntity<SuccessPayload>(new SuccessPayload(message), status);
  }
  protected ResponseEntity<SuccessPayload> sendSuccessResponse(String message, Object data) {
    return new ResponseEntity<SuccessPayload>(new SuccessPayload(message, data), HttpStatus.OK);
  }
  protected ResponseEntity<SuccessPayload> sendSuccessResponse(String message, Object data, @NonNull HttpStatus status) {
    return new ResponseEntity<SuccessPayload>(new SuccessPayload(message, data), status);
  }

  public ResponseEntity<ErrorPayload> sendErrorResponse(String message) {
    return new ResponseEntity<ErrorPayload>(new ErrorPayload(message), HttpStatus.OK);
  }
  public ResponseEntity<ErrorPayload> sendErrorResponse(String message, @NonNull HttpStatus status) {
    return new ResponseEntity<ErrorPayload>(new ErrorPayload(message), status);
  }
  public ResponseEntity<ErrorPayload> sendErrorResponse(String message, Object errors) {
    return new ResponseEntity<ErrorPayload>(new ErrorPayload(message, errors), HttpStatus.INTERNAL_SERVER_ERROR);
  }

  public ResponseEntity<ErrorPayload> sendErrorResponse(String message, Object errors, @NonNull HttpStatus status) {
    return new ResponseEntity<ErrorPayload>(new ErrorPayload(message, errors), status);
  }
}
