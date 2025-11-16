package com.its.persistence.repositories;

import com.its.domain.entities.Topic;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Topic Repository following Interface Segregation Principle
 */
@Repository
public interface TopicRepository extends MongoRepository<Topic, String> {
    
    List<Topic> findByCourseId(String courseId);
    
    List<Topic> findByNameContainingIgnoreCase(String name);
}