package com.its.persistence.repositories;

import com.its.domain.entities.ContentHistory;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Content History Repository for version tracking
 */
@Repository
public interface ContentHistoryRepository extends MongoRepository<ContentHistory, String> {
    
    List<ContentHistory> findByMaterialIdOrderByVersionDesc(String materialId);
    
    List<ContentHistory> findByChangedBy(String userId);
}