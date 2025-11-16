package com.its.domain.entities;

/**
 * User roles supporting Liskov Substitution Principle
 * Each role can be substituted without breaking functionality
 */
public enum UserRole {
    STUDENT("Student", "Can access learning materials and courses"),
    INSTRUCTOR("Instructor", "Can create and manage learning content"),
    ADMIN("Admin", "Can manage users and system configuration");

    private final String displayName;
    private final String description;

    UserRole(String displayName, String description) {
        this.displayName = displayName;
        this.description = description;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getDescription() {
        return description;
    }

    public boolean canCreateContent() {
        return this == INSTRUCTOR || this == ADMIN;
    }

    public boolean canManageUsers() {
        return this == ADMIN;
    }

    public boolean canAccessContent() {
        return true; // All roles can access content
    }
}