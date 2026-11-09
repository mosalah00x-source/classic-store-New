package com.classicstore.config;
import com.classicstore.common.error.ApiError;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.AuthenticationEntryPoint;
import java.util.Map;
@Configuration
public class SecurityConfig {
 @Bean SecurityFilterChain securityFilterChain(HttpSecurity http,ObjectMapper mapper)throws Exception{
  AuthenticationEntryPoint entry=(request,response,ex)->write(mapper,response,HttpStatus.UNAUTHORIZED,
   new ApiError("UNAUTHORIZED","يلزم تسجيل الدخول","Authentication is required",traceId(request),Map.of()));
  AccessDeniedHandler denied=(request,response,ex)->write(mapper,response,HttpStatus.FORBIDDEN,
   new ApiError("FORBIDDEN","غير مسموح بالوصول","Access is forbidden",traceId(request),Map.of()));
  return http.csrf(AbstractHttpConfigurer::disable)
   .sessionManagement(s->s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
   .authorizeHttpRequests(a->a.requestMatchers("/actuator/health").permitAll().anyRequest().authenticated())
   .exceptionHandling(e->e.authenticationEntryPoint(entry).accessDeniedHandler(denied)).build();
 }
 private static String traceId(jakarta.servlet.http.HttpServletRequest request){Object v=request.getAttribute("traceId");return v==null?"":v.toString();}
 private static void write(ObjectMapper mapper,HttpServletResponse response,HttpStatus status,ApiError body)throws java.io.IOException{
  response.setStatus(status.value());response.setContentType(MediaType.APPLICATION_JSON_VALUE);mapper.writeValue(response.getOutputStream(),body);
 }
}