package com.its.business.interfaces;

import com.its.domain.entities.LearningMaterial;
import com.its.domain.dto.LearningMaterialDto;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

/**
 * Content Management Service Interface following Interface Segregation Principle
 */
public interface IContentManagementService {
    
    LearningMaterial createContent(LearningMaterialDto contentDto, String createdBy);
    
    LearningMaterial updateContent(String id, LearningMaterialDto contentDto, String userId);
    
    boolean deleteContent(String id, String userId);
    
    Optional<LearningMaterial> getContentById(String id);
    
    List<LearningMaterial> getAllContent();
    
    List<LearningMaterial> getContentByTopic(String topicId);
    
    List<LearningMaterial> getContentByCreator(String userId);
    
    List<LearningMaterial> searchContent(String query);
    
    String uploadFile(MultipartFile file, String userId);
    
    boolean canUserModifyContent(String contentId, String userId, String userRole);
}