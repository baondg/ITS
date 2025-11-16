package com.its.application.controllers;

import com.its.business.interfaces.IAuthenticationService;
import com.its.domain.dto.UserRegistrationDto;
import com.its.domain.dto.UserLoginDto;
import com.its.domain.dto.JwtAuthenticationResponse;
import com.its.domain.dto.UserResponseDto;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RestController;

/**
 * Authentication Controller following Single Responsibility Principle
 * Handles authentication-related HTTP requests
 */
@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final IAuthenticationService authenticationService;

    @Autowired
    public AuthController(IAuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody UserRegistrationDto registrationDto) {
        try {
            JwtAuthenticationResponse response = authenticationService.register(registrationDto);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody UserLoginDto loginDto) {
        try {
            JwtAuthenticationResponse response = authenticationService.login(loginDto);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponseDto> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        // For simplicity, we'll return basic user info
        // In a real implementation, you'd get the user ID from the JWT token
        return ResponseEntity.ok(new UserResponseDto());
    }

    @GetMapping("/check-email/{email}")
    public ResponseEntity<Boolean> checkEmailExists(@PathVariable String email) {
        boolean exists = authenticationService.isEmailExists(email);
        return ResponseEntity.ok(exists);
    }
}