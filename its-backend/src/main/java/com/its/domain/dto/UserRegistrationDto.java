package com.its.domain.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import com.its.domain.entities.UserRole;

/**
 * User registration DTO following Data Transfer Object pattern
 */
public class UserRegistrationDto {
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;
    
    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 40, message = "Password must be between 6 and 40 characters")
    private String password;
    
    @NotBlank(message = "Role is required")
    private String role;
    
    private String firstName;
    private String lastName;
    private String institution;

    public UserRegistrationDto() {}

    // Getters and setters
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getInstitution() {
        return institution;
    }

    public void setInstitution(String institution) {
        this.institution = institution;
    }

    public UserRole getRoleEnum() {
        try {
            return UserRole.valueOf(role.toUpperCase());
        } catch (IllegalArgumentException e) {
            return UserRole.STUDENT; // Default role
        }
    }
}