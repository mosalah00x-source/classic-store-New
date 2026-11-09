package com.classicstore.common.error;
import java.util.Map;
public record ApiError(String code, String messageAr, String messageEn, String traceId, Map<String, Object> details) {
 public ApiError { details = details == null ? Map.of() : Map.copyOf(details); }
}