package com.its.persistence.repositories;

import com.its.domain.entities.LearningMaterial;
import com.its.domain.entities.ContentType;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Learning Material Repository following Interface Segregation Principle
 */
@Repository
public interface LearningMaterialRepository extends MongoRepository<LearningMaterial, String> {
    
    List<LearningMaterial> findByTopicId(String topicId);
    
    List<LearningMaterial> findByCreatedBy(String instructorId);
    
    List<LearningMaterial> findByType(ContentType type);
    
    List<LearningMaterial> findByPublished(boolean published);
    
    @Query("{ 'title': { $regex: ?0, $options: 'i' } }")
    List<LearningMaterial> findByTitleContainingIgnoreCase(String title);
    
    @Query("{ 'topicId': ?0, 'published': true }")
    List<LearningMaterial> findPublishedByTopicId(String topicId);
    
    @Query("{ 'type': ?0, 'published': true }")
    List<LearningMaterial> findPublishedByType(ContentType type);
}