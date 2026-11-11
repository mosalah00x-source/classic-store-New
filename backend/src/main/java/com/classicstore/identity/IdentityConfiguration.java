package com.classicstore.identity;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import java.util.concurrent.ThreadPoolExecutor;
@Configuration
@EnableAsync
@EnableConfigurationProperties(IdentityProperties.class)
public class IdentityConfiguration {
 @Bean(name="taskExecutor") ThreadPoolTaskExecutor taskExecutor(){
  ThreadPoolTaskExecutor executor=new ThreadPoolTaskExecutor();
  executor.setCorePoolSize(2);executor.setMaxPoolSize(4);executor.setQueueCapacity(100);
  executor.setThreadNamePrefix("identity-mail-");
  executor.setWaitForTasksToCompleteOnShutdown(true);executor.setAwaitTerminationSeconds(10);
  executor.setRejectedExecutionHandler(new ThreadPoolExecutor.AbortPolicy());
  return executor;
 }
}