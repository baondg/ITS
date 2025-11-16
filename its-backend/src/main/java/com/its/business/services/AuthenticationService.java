package com.its.business.services;

import com.its.business.interfaces.IAuthenticationService;
import com.its.domain.dto.*;
import com.its.domain.entities.User;
import com.its.domain.entities.UserProfile;
import com.its.persistence.repositories.UserRepository;
import com.its.infrastructure.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Authentication Service Implementation following Single Responsibility Principle
 * Handles user registration, login, and authentication
 */
@Service
public class AuthenticationService implements IAuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Autowired
    public AuthenticationService(UserRepository userRepository, 
                               PasswordEncoder passwordEncoder,
                               JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    public JwtAuthenticationResponse register(UserRegistrationDto registrationDto) {
        if (isEmailExists(registrationDto.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setEmail(registrationDto.getEmail());
        user.setPassword(passwordEncoder.encode(registrationDto.getPassword()));
        user.setRole(registrationDto.getRoleEnum());
        
        UserProfile profile = new UserProfile();
        profile.setFirstName(registrationDto.getFirstName());
        profile.setLastName(registrationDto.getLastName());
        profile.setInstitution(registrationDto.getInstitution());
        user.setProfile(profile);

        User savedUser = userRepository.save(user);
        String token = jwtTokenProvider.generateToken(savedUser.getEmail());
        
        return new JwtAuthenticationResponse(token, convertToUserResponse(savedUser));
    }

    @Override
    public JwtAuthenticationResponse login(UserLoginDto loginDto) {
        User user = userRepository.findActiveUserByEmail(loginDto.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(loginDto.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtTokenProvider.generateToken(user.getEmail());
        return new JwtAuthenticationResponse(token, convertToUserResponse(user));
    }

    @Override
    public UserResponseDto getCurrentUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return convertToUserResponse(user);
    }

    @Override
    public boolean isEmailExists(String email) {
        return userRepository.existsByEmail(email);
    }

    private UserResponseDto convertToUserResponse(User user) {
        UserResponseDto response = new UserResponseDto();
        response.setId(user.getId());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole().name());
        
        if (user.getProfile() != null) {
            response.setFirstName(user.getProfile().getFirstName());
            response.setLastName(user.getProfile().getLastName());
            response.setInstitution(user.getProfile().getInstitution());
            response.setAvatar(user.getProfile().getAvatar());
        }
        
        return response;
    }
}