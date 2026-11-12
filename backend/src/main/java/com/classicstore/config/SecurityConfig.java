package com.classicstore.config;

import com.classicstore.common.error.ApiError;
import com.classicstore.common.tracing.CorrelationIdFilter;
import com.classicstore.identity.security.JwtAuthenticationFilter;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import java.util.Map;
import java.util.Arrays;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {
 @Bean PasswordEncoder passwordEncoder(){ return new BCryptPasswordEncoder(12); }

 @Bean SecurityFilterChain securityFilterChain(HttpSecurity http,ObjectMapper mapper,
   CorrelationIdFilter correlationIdFilter,JwtAuthenticationFilter jwtFilter,CorsConfigurationSource corsConfigurationSource)throws Exception {
  AuthenticationEntryPoint entry=(request,response,ex)->{
   boolean invalid=Boolean.TRUE.equals(request.getAttribute("identity.invalidToken"));
   write(mapper,response,HttpStatus.UNAUTHORIZED,invalid
    ? new ApiError("INVALID_TOKEN","رمز الدخول غير صالح أو منتهٍ","Invalid or expired token",traceId(request),Map.of())
    : new ApiError("UNAUTHENTICATED","يجب تسجيل الدخول","Authentication required",traceId(request),Map.of()));
  };
  AccessDeniedHandler denied=(request,response,ex)->write(mapper,response,HttpStatus.FORBIDDEN,
   new ApiError("FORBIDDEN","ليس لديك صلاحية لهذا الإجراء","You do not have permission",traceId(request),Map.of()));
  return http.cors(cors->cors.configurationSource(corsConfigurationSource)).csrf(AbstractHttpConfigurer::disable)
   .sessionManagement(s->s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
   .authorizeHttpRequests(a->a
    .requestMatchers("/actuator/health").permitAll()
    .requestMatchers("/api/v1/auth/register","/api/v1/auth/login","/api/v1/auth/refresh",
      "/api/v1/auth/password/forgot","/api/v1/auth/password/reset").permitAll()
    .requestMatchers("/api/v1/me","/api/v1/me/**","/api/v1/auth/password/change").hasRole("CUSTOMER")
    .requestMatchers("/api/v1/auth/logout").authenticated()
    .anyRequest().authenticated())
   .exceptionHandling(e->e.authenticationEntryPoint(entry).accessDeniedHandler(denied))
   .addFilterBefore(correlationIdFilter,UsernamePasswordAuthenticationFilter.class)
   .addFilterBefore(jwtFilter,UsernamePasswordAuthenticationFilter.class).build();
 }
 @Bean CorsConfigurationSource corsConfigurationSource(@Value("${security.cors.allowed-origins:}") String allowedOrigins){
  CorsConfiguration config=new CorsConfiguration();
  config.setAllowedOrigins(Arrays.stream(allowedOrigins.split(",")).map(String::trim).filter(v->!v.isEmpty()).toList());
  config.setAllowedMethods(List.of("GET","POST","PUT","PATCH","DELETE","OPTIONS"));
  config.setAllowedHeaders(List.of("Authorization","Content-Type","X-Correlation-Id"));
  config.setExposedHeaders(List.of("X-Correlation-Id"));
  config.setAllowCredentials(false);
  UrlBasedCorsConfigurationSource source=new UrlBasedCorsConfigurationSource();
  source.registerCorsConfiguration("/api/**",config);
  return source;
 }
 @Bean FilterRegistrationBean<CorrelationIdFilter> correlationIdFilterRegistration(CorrelationIdFilter filter){
  FilterRegistrationBean<CorrelationIdFilter> r=new FilterRegistrationBean<>(filter);r.setEnabled(false);return r;
 }
 @Bean FilterRegistrationBean<JwtAuthenticationFilter> jwtFilterRegistration(JwtAuthenticationFilter filter){
  FilterRegistrationBean<JwtAuthenticationFilter> r=new FilterRegistrationBean<>(filter);r.setEnabled(false);return r;
 }
 private static String traceId(jakarta.servlet.http.HttpServletRequest r){Object v=r.getAttribute("traceId");return v==null?"":v.toString();}
 private static void write(ObjectMapper m,HttpServletResponse r,HttpStatus s,ApiError b)throws java.io.IOException{
  r.setStatus(s.value());r.setContentType(MediaType.APPLICATION_JSON_VALUE);m.writeValue(r.getOutputStream(),b);
 }
}