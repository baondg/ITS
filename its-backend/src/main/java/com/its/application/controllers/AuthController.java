package com.its.application.controllers;

import com.its.business.interfaces.IAuthenticationService;
import com.its.domain.dto.UserRegistrationDto;
import com.its.domain.dto.UserLoginDto;
import com.its.domain.dto.JwtAuthenticationResponse;
import com.its.domain.dto.UserResponseDto;
import com.its.domain.dto.UserProfileUpdateDto;
import com.its.domain.entities.User;
import com.its.infrastructure.security.JwtTokenProvider;
import com.its.persistence.repositories.UserRepository;
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
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;

    @Autowired
    public AuthController(IAuthenticationService authenticationService, 
                         UserRepository userRepository,
                         JwtTokenProvider jwtTokenProvider) {
        this.authenticationService = authenticationService;
        this.userRepository = userRepository;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody UserRegistrationDto registrationDto) {
        try {
            System.out.println("Registration request received for: " + registrationDto.getEmail());
            JwtAuthenticationResponse response = authenticationService.register(registrationDto);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            System.err.println("Registration error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody UserLoginDto loginDto) {
        try {
            System.out.println("Login request received for: " + loginDto.getEmail());
            JwtAuthenticationResponse response = authenticationService.login(loginDto);
            System.out.println("Login successful for: " + loginDto.getEmail());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            System.err.println("Login error for " + loginDto.getEmail() + ": " + e.getMessage());
            e.printStackTrace();
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

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @Valid @RequestBody UserProfileUpdateDto profileDto,
            @RequestHeader("Authorization") String token) {
        try {
            // Extract token from "Bearer <token>"
            String jwtToken = token.substring(7);
            String email = jwtTokenProvider.getEmailFromToken(jwtToken);
            
            System.out.println("Profile update request for: " + email);
            
            // Find user by email
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            // Update user profile
            user.getProfile().setFirstName(profileDto.getFirstName());
            user.getProfile().setLastName(profileDto.getLastName());
            user.getProfile().setExpertise(profileDto.getExpertise());
            user.getProfile().setBio(profileDto.getBio());
            
            // Save updated user
            User updatedUser = userRepository.save(user);
            
            // Convert to response DTO
            UserResponseDto responseDto = new UserResponseDto();
            responseDto.setId(updatedUser.getId());
            responseDto.setEmail(updatedUser.getEmail());
            responseDto.setRole(updatedUser.getRole().name());
            responseDto.setFirstName(updatedUser.getProfile().getFirstName());
            responseDto.setLastName(updatedUser.getProfile().getLastName());
            responseDto.setExpertise(updatedUser.getProfile().getExpertise());
            responseDto.setBio(updatedUser.getProfile().getBio());
            
            System.out.println("Profile updated successfully for: " + email);
            return ResponseEntity.ok(responseDto);
        } catch (Exception e) {
            System.err.println("Profile update error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Failed to update profile: " + e.getMessage());
        }
    }
}