package com.classicstore.common.tracing;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.UUID;
@Component
public class CorrelationIdFilter extends OncePerRequestFilter {
 public static final String HEADER="X-Correlation-Id";
 @Override protected void doFilterInternal(HttpServletRequest request,HttpServletResponse response,FilterChain chain)
  throws ServletException,IOException {
  String supplied=request.getHeader(HEADER);
  String traceId=supplied==null||supplied.isBlank()?UUID.randomUUID().toString():supplied;
  MDC.put("traceId",traceId); request.setAttribute("traceId",traceId); response.setHeader(HEADER,traceId);
  try { chain.doFilter(request,response); } finally { MDC.remove("traceId"); }
 }
}