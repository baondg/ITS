package com.its.business.interfaces;

import com.its.domain.dto.UserRegistrationDto;
import com.its.domain.dto.UserLoginDto;
import com.its.domain.dto.JwtAuthenticationResponse;
import com.its.domain.dto.UserResponseDto;

/**
 * Authentication Service Interface following Interface Segregation Principle
 * Contains only authentication-related methods
 */
public interface IAuthenticationService {
    
    JwtAuthenticationResponse register(UserRegistrationDto registrationDto);
    
    JwtAuthenticationResponse login(UserLoginDto loginDto);
    
    UserResponseDto getCurrentUser(String userId);
    
    boolean isEmailExists(String email);
}