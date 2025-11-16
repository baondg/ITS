package com.its.business.services;

import com.its.business.interfaces.IContentManagementService;
import com.its.domain.dto.LearningMaterialDto;
import com.its.domain.entities.LearningMaterial;
import com.its.domain.entities.ContentHistory;
import com.its.persistence.repositories.LearningMaterialRepository;
import com.its.persistence.repositories.ContentHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Content Management Service Implementation following Single Responsibility Principle
 * Handles learning content CRUD operations
 */
@Service
public class ContentManagementService implements IContentManagementService {

    private final LearningMaterialRepository materialRepository;
    private final ContentHistoryRepository historyRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Autowired
    public ContentManagementService(LearningMaterialRepository materialRepository,
                                   ContentHistoryRepository historyRepository) {
        this.materialRepository = materialRepository;
        this.historyRepository = historyRepository;
    }

    @Override
    public LearningMaterial createContent(LearningMaterialDto contentDto, String createdBy) {
        LearningMaterial material = new LearningMaterial();
        material.setTitle(contentDto.getTitle());
        material.setType(contentDto.getContentType());
        material.setContent(contentDto.getContent());
        material.setTopicId(contentDto.getTopicId());
        material.setCreatedBy(createdBy);
        material.setPublished(contentDto.isPublished());

        LearningMaterial savedMaterial = materialRepository.save(material);
        
        // Create history record
        saveContentHistory(savedMaterial, "Content created", createdBy, 1);
        
        return savedMaterial;
    }

    @Override
    public LearningMaterial updateContent(String id, LearningMaterialDto contentDto, String userId) {
        LearningMaterial material = materialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Content not found"));

        if (!canUserModifyContent(id, userId, "INSTRUCTOR")) {
            throw new RuntimeException("Access denied");
        }

        // Get current version
        List<ContentHistory> history = historyRepository.findByMaterialIdOrderByVersionDesc(id);
        int newVersion = history.isEmpty() ? 2 : history.get(0).getVersion() + 1;

        material.setTitle(contentDto.getTitle());
        material.setContent(contentDto.getContent());
        material.setPublished(contentDto.isPublished());

        LearningMaterial savedMaterial = materialRepository.save(material);
        
        // Save history
        saveContentHistory(savedMaterial, "Content updated", userId, newVersion);
        
        return savedMaterial;
    }

    @Override
    public boolean deleteContent(String id, String userId) {
        LearningMaterial material = materialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Content not found"));

        if (!canUserModifyContent(id, userId, "INSTRUCTOR")) {
            throw new RuntimeException("Access denied");
        }

        materialRepository.deleteById(id);
        return true;
    }

    @Override
    public Optional<LearningMaterial> getContentById(String id) {
        return materialRepository.findById(id);
    }

    @Override
    public List<LearningMaterial> getAllContent() {
        return materialRepository.findAll();
    }

    @Override
    public List<LearningMaterial> getContentByTopic(String topicId) {
        return materialRepository.findPublishedByTopicId(topicId);
    }

    @Override
    public List<LearningMaterial> getContentByCreator(String userId) {
        return materialRepository.findByCreatedBy(userId);
    }

    @Override
    public List<LearningMaterial> searchContent(String query) {
        return materialRepository.findByTitleContainingIgnoreCase(query);
    }

    @Override
    public String uploadFile(MultipartFile file, String userId) {
        try {
            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generate unique filename
            String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(filename);

            // Save file
            Files.copy(file.getInputStream(), filePath);

            return filePath.toString();
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file", e);
        }
    }

    @Override
    public boolean canUserModifyContent(String contentId, String userId, String userRole) {
        LearningMaterial material = materialRepository.findById(contentId).orElse(null);
        if (material == null) return false;

        // Admin can modify everything
        if ("ADMIN".equals(userRole)) return true;

        // Instructor can modify their own content
        return "INSTRUCTOR".equals(userRole) && material.getCreatedBy().equals(userId);
    }

    private void saveContentHistory(LearningMaterial material, String changeDescription, 
                                   String changedBy, int version) {
        ContentHistory history = new ContentHistory();
        history.setMaterialId(material.getId());
        history.setTitle(material.getTitle());
        history.setContent(material.getContent());
        history.setChangeDescription(changeDescription);
        history.setChangedBy(changedBy);
        history.setVersion(version);
        
        historyRepository.save(history);
    }
}