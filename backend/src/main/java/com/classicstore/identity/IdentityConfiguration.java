package com.classicstore.identity;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;
@Configuration
@EnableConfigurationProperties(IdentityProperties.class)
public class IdentityConfiguration {}