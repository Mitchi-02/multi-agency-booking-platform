package project.back.msusers.exception;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.multipart.MultipartException;
import org.springframework.web.multipart.support.MissingServletRequestPartException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import project.back.msusers.response.generic.ErrorPayload;

@ControllerAdvice
public class GlobalExceptionHandler {
  
  @ExceptionHandler({MethodArgumentNotValidException.class})
  public ResponseEntity<?> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex) {
     Map<String, List<String>> errors = ex.getBindingResult()
        .getFieldErrors()
        .stream()
        .collect(Collectors.groupingBy(FieldError::getField,
                Collectors.mapping(DefaultMessageSourceResolvable::getDefaultMessage, Collectors.toList())));

    return new ResponseEntity<ErrorPayload>
      (new ErrorPayload(errors.isEmpty() ? "Data validation failed" : errors.values().iterator().next().get(0), errors), 
        HttpStatus.UNPROCESSABLE_ENTITY);
  }

  @ExceptionHandler({HttpMessageNotReadableException.class})
  public ResponseEntity<?> handleHttpMessageNotReadableException(HttpMessageNotReadableException ex) {
    return new ResponseEntity<ErrorPayload>(new ErrorPayload("Please provide a body"), HttpStatus.UNPROCESSABLE_ENTITY);
  }

  @ExceptionHandler({NoResourceFoundException.class})
  public ResponseEntity<?> handleNoResourceFoundException(NoResourceFoundException ex) {
    return new ResponseEntity<ErrorPayload>(new ErrorPayload("Resource not found"), HttpStatus.NOT_FOUND);
  }

  @ExceptionHandler({HttpRequestMethodNotSupportedException.class})
  public ResponseEntity<?> handleHttpRequestMethodNotSupportedException(HttpRequestMethodNotSupportedException ex) {
    return new ResponseEntity<ErrorPayload>(new ErrorPayload("Method not supported"), HttpStatus.METHOD_NOT_ALLOWED);
  }

  @ExceptionHandler({MethodArgumentTypeMismatchException.class})
  public ResponseEntity<?> handleMethodArgumentTypeMismatchException(MethodArgumentTypeMismatchException ex) {
    return new ResponseEntity<ErrorPayload>(new ErrorPayload("Invalid parameter type"), HttpStatus.UNPROCESSABLE_ENTITY);
  }

  @ExceptionHandler({MultipartException.class})
  public ResponseEntity<?> handleMultipartException(MultipartException ex) {
    return new ResponseEntity<ErrorPayload>(new ErrorPayload("Request must be multipart/formdata"), HttpStatus.UNPROCESSABLE_ENTITY);
  }

  @ExceptionHandler({MissingServletRequestPartException.class})
  public ResponseEntity<?> handleMissingServletRequestPartException(MissingServletRequestPartException ex) {
    return new ResponseEntity<ErrorPayload>(new ErrorPayload(ex.getMessage()), HttpStatus.UNPROCESSABLE_ENTITY);
  }

//  @ExceptionHandler({Exception.class})
//  public ResponseEntity<?> handleException(Exception ex) {
//    return new ResponseEntity<ErrorPayload>(new ErrorPayload("Internal server error"), HttpStatus.INTERNAL_SERVER_ERROR);
//  }
}
