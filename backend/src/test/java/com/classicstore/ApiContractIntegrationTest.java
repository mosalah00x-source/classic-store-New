package com.classicstore;
import com.classicstore.common.error.BusinessException;
import com.classicstore.common.tracing.CorrelationIdFilter;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.http.HttpStatus;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
@SpringBootTest @AutoConfigureMockMvc @ActiveProfiles("test") @Import(ApiContractIntegrationTest.TestEndpoints.class)
class ApiContractIntegrationTest {
 @Autowired MockMvc mvc;
 @Test void actuatorHealthIsPublicAndUp() throws Exception {
  mvc.perform(get("/actuator/health")).andExpect(status().isOk()).andExpect(jsonPath("$.status").value("UP"));
 }
 @Test void businessExceptionReturns422AndTraceIdMatchesCorrelationHeader() throws Exception {
  mvc.perform(get("/test/business-error").header("X-Correlation-Id","abc123"))
   .andExpect(status().isUnprocessableEntity()).andExpect(header().string("X-Correlation-Id","abc123"))
   .andExpect(jsonPath("$.code").value("ORDER_NOT_ALLOWED"))
   .andExpect(jsonPath("$.messageAr").value("لا يمكن تنفيذ الطلب"))
   .andExpect(jsonPath("$.messageEn").value("The order cannot be submitted"))
   .andExpect(jsonPath("$.traceId").value("abc123")).andExpect(jsonPath("$.details.reason").value("TEST_RULE"));
 }
 @Test void suppliedCorrelationIdIsEchoedInResponseHeader() throws Exception {
  mvc.perform(get("/actuator/health").header("X-Correlation-Id","abc123"))
   .andExpect(status().isOk()).andExpect(header().string("X-Correlation-Id","abc123"));
 }
 @Test void protectedPathReturnsStandard401ErrorBody() throws Exception {
  mvc.perform(get("/test/protected").header("X-Correlation-Id","unauth-test"))
   .andExpect(status().isUnauthorized()).andExpect(header().string("X-Correlation-Id","unauth-test"))
   .andExpect(jsonPath("$.code").value("UNAUTHORIZED"))
   .andExpect(jsonPath("$.messageAr").isNotEmpty()).andExpect(jsonPath("$.messageEn").isNotEmpty())
   .andExpect(jsonPath("$.traceId").value("unauth-test")).andExpect(jsonPath("$.details").isMap());
 }
 @TestConfiguration static class TestEndpoints {
  @Bean @Order(0) SecurityFilterChain businessErrorTestChain(HttpSecurity http, CorrelationIdFilter correlationIdFilter) throws Exception {
   return http.securityMatcher("/test/business-error").csrf(AbstractHttpConfigurer::disable)
    .authorizeHttpRequests(a->a.anyRequest().permitAll())
    .addFilterBefore(correlationIdFilter, org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class).build();
  }
  @Bean TestController testController(){return new TestController();}
 }
 @RestController static class TestController {
  @GetMapping("/test/business-error") String businessError(){
   throw new BusinessException("ORDER_NOT_ALLOWED","لا يمكن تنفيذ الطلب","The order cannot be submitted",
    HttpStatus.UNPROCESSABLE_ENTITY,Map.of("reason","TEST_RULE"));
  }
  @GetMapping("/test/protected") String protectedPath(){return "protected";}
 }
}