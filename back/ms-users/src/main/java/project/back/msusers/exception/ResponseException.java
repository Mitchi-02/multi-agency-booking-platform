package project.back.msusers.exception;


import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class ResponseException extends Exception {

  private String message;
  private Object errors = null;

    public ResponseException(String message) {
        super(message);
        this.message = message;
    }
}
