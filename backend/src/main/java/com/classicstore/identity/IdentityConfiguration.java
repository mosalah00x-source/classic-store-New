package com.classicstore.identity;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
@Configuration
@EnableAsync
@EnableConfigurationProperties(IdentityProperties.class)
public class IdentityConfiguration {}