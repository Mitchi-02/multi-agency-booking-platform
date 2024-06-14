package project.back.msnotifications.exception;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import project.back.msnotifications.response.generic.ErrorPayload;

@ControllerAdvice
public class GlobalExceptionHandler {
  
  @ExceptionHandler({MethodArgumentNotValidException.class})
  public ResponseEntity<ErrorPayload> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex) {
     Map<String, List<String>> errors = ex.getBindingResult()
        .getFieldErrors()
        .stream()
        .collect(Collectors.groupingBy(FieldError::getField,
                Collectors.mapping(DefaultMessageSourceResolvable::getDefaultMessage, Collectors.toList())));

    return new ResponseEntity<ErrorPayload>(new ErrorPayload(errors.isEmpty() ? "Data validation failed" : errors.values().iterator().next().get(0), errors), HttpStatus.UNPROCESSABLE_ENTITY);
  }
}
