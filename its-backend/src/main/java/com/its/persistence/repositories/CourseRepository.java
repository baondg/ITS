package com.its.persistence.repositories;

import com.its.domain.entities.Course;
import com.its.domain.entities.DifficultyLevel;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Course Repository following Interface Segregation Principle
 */
@Repository
public interface CourseRepository extends MongoRepository<Course, String> {
    
    List<Course> findByCreatedBy(String instructorId);
    
    List<Course> findBySubject(String subject);
    
    List<Course> findByDifficulty(DifficultyLevel difficulty);
    
    List<Course> findByPublished(boolean published);
    
    @Query("{ 'title': { $regex: ?0, $options: 'i' } }")
    List<Course> findByTitleContainingIgnoreCase(String title);
    
    @Query("{ 'subject': ?0, 'difficulty': ?1, 'published': true }")
    List<Course> findPublishedBySubjectAndDifficulty(String subject, DifficultyLevel difficulty);
}