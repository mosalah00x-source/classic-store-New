package com.classicstore.common.error;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import java.util.LinkedHashMap;
import java.util.Map;
@RestControllerAdvice
public class GlobalExceptionHandler {
 private String traceId(HttpServletRequest request){Object value=request.getAttribute("traceId");return value==null?"":value.toString();}
 @ExceptionHandler(BusinessException.class)
 public ResponseEntity<ApiError> business(BusinessException ex,HttpServletRequest request){
  return ResponseEntity.status(ex.getStatus()).body(new ApiError(ex.getCode(),ex.getMessageAr(),ex.getMessageEn(),traceId(request),ex.getDetails()));
 }
 @ExceptionHandler(MethodArgumentNotValidException.class)
 public ResponseEntity<ApiError> validation(MethodArgumentNotValidException ex,HttpServletRequest request){
  Map<String,Object> fields=new LinkedHashMap<>();
  for(FieldError error:ex.getBindingResult().getFieldErrors()) fields.put(error.getField(),error.getDefaultMessage());
  return ResponseEntity.badRequest().body(new ApiError("VALIDATION_ERROR","البيانات المدخلة غير صحيحة","Submitted data is invalid",traceId(request),Map.of("fieldErrors",fields)));
 }
 @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
 public ResponseEntity<ApiError> unsupportedMediaType(HttpMediaTypeNotSupportedException ex,HttpServletRequest request){
  return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).body(new ApiError("UNSUPPORTED_MEDIA_TYPE","نوع المحتوى غير مدعوم","Unsupported media type",traceId(request),Map.of()));
 }
 @ExceptionHandler(HttpMessageNotReadableException.class)
 public ResponseEntity<ApiError> unreadable(HttpMessageNotReadableException ex,HttpServletRequest request){
  return ResponseEntity.badRequest().body(new ApiError("VALIDATION_ERROR","بيانات الإدخال غير صحيحة","Invalid input data",traceId(request),Map.of()));
 }
 @ExceptionHandler(ConstraintViolationException.class)
 public ResponseEntity<ApiError> constraint(ConstraintViolationException ex,HttpServletRequest request){
  return ResponseEntity.badRequest().body(new ApiError("VALIDATION_ERROR","البيانات المدخلة غير صحيحة","Submitted data is invalid",traceId(request),Map.of("violations",ex.getConstraintViolations().stream().map(v->v.getMessage()).toList())));
 }
 @ExceptionHandler(Exception.class)
 public ResponseEntity<ApiError> unexpected(Exception ex,HttpServletRequest request){
  return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiError("INTERNAL_ERROR","حدث خطأ داخلي","An internal error occurred",traceId(request),Map.of()));
 }
}