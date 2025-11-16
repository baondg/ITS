package com.its.business.interfaces;

import com.its.domain.entities.User;
import com.its.domain.entities.UserRole;

import java.util.Optional;
import java.util.List;

/**
 * User Management Service Interface following Interface Segregation Principle
 */
public interface IUserManagementService {
    
    Optional<User> findUserById(String id);
    
    Optional<User> findUserByEmail(String email);
    
    List<User> getAllUsers();
    
    List<User> getUsersByRole(UserRole role);
    
    User updateUserProfile(String userId, User user);
    
    boolean deactivateUser(String userId);
    
    boolean activateUser(String userId);
}