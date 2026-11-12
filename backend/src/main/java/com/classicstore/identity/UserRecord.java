package com.classicstore.identity;
import java.util.UUID;
public record UserRecord(UUID id,String email,String phone,String passwordHash,String firstName,String lastName,String role,boolean active) {}