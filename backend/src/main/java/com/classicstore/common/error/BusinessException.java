package com.classicstore.common.error;
import org.springframework.http.HttpStatus;
import java.util.Map;
public class BusinessException extends RuntimeException {
 private final String code, messageAr, messageEn;
 private final HttpStatus status;
 private final Map<String,Object> details;
 public BusinessException(String code,String messageAr,String messageEn,HttpStatus status,Map<String,Object> details) {
  super(messageEn); this.code=code; this.messageAr=messageAr; this.messageEn=messageEn; this.status=status;
  this.details=details==null?Map.of():Map.copyOf(details);
 }
 public String getCode(){return code;} public String getMessageAr(){return messageAr;}
 public String getMessageEn(){return messageEn;} public HttpStatus getStatus(){return status;}
 public Map<String,Object> getDetails(){return details;}
}