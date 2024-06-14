package project.back.msusers.response.generic;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ErrorPayload {
  private String message;
  private Object errors = null;

  public ErrorPayload(String message) {
    this.message = message;
  }
}