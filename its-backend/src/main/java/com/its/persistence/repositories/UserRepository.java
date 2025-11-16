package com.its.persistence.repositories;

import com.its.domain.entities.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * User Repository following Interface Segregation Principle
 * Contains only user-specific data access methods
 */
@Repository
public interface UserRepository extends MongoRepository<User, String> {
    
    Optional<User> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    @Query("{ 'email': ?0, 'active': true }")
    Optional<User> findActiveUserByEmail(String email);
}