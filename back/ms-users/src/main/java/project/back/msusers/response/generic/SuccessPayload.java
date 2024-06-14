package project.back.msusers.response.generic;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SuccessPayload {
  private String message;
  private Object data = null;

  public SuccessPayload(String message) {
    this.message = message;
  }
}