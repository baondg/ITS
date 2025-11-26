package com.its.domain.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Data Transfer Object for User Profile Updates
 * Following DTO pattern to separate domain from presentation layer
 */
public class UserProfileUpdateDto {
    
    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
    private String firstName;
    
    @NotBlank(message = "Last name is required")
    @Size(min = 2, max = 50, message = "Last name must be between 2 and 50 characters")
    private String lastName;
    
    @Size(max = 100, message = "Expertise must be less than 100 characters")
    private String expertise;
    
    @Size(max = 500, message = "Bio must be less than 500 characters")
    private String bio;

    // Constructors
    public UserProfileUpdateDto() {
    }

    public UserProfileUpdateDto(String firstName, String lastName, String expertise, String bio) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.expertise = expertise;
        this.bio = bio;
    }

    // Getters and Setters
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

    public String getExpertise() {
        return expertise;
    }

    public void setExpertise(String expertise) {
        this.expertise = expertise;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }
}
