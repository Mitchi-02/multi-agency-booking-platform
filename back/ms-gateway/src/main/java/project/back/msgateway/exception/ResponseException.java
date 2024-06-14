package project.back.msgateway.exception;


import org.springframework.http.HttpStatusCode;
import org.springframework.web.server.ResponseStatusException;

import lombok.Data;

@Data
public class ResponseException extends ResponseStatusException {

  private String message;
  public ResponseException(String message, HttpStatusCode status) {
    super(status);
    this.message = message;
  }
}
