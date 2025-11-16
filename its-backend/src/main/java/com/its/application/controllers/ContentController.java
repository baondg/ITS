package com.its.application.controllers;

import com.its.business.interfaces.IContentManagementService;
import com.its.domain.dto.LearningMaterialDto;
import com.its.domain.entities.LearningMaterial;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * Content Controller following Single Responsibility Principle
 * Handles content management HTTP requests
 */
@RestController
@RequestMapping("/content")
@CrossOrigin(origins = "http://localhost:3000")
public class ContentController {

    private final IContentManagementService contentService;

    @Autowired
    public ContentController(IContentManagementService contentService) {
        this.contentService = contentService;
    }

    @GetMapping
    public ResponseEntity<List<LearningMaterial>> getAllContent() {
        List<LearningMaterial> materials = contentService.getAllContent();
        return ResponseEntity.ok(materials);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LearningMaterial> getContentById(@PathVariable String id) {
        return contentService.getContentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/topic/{topicId}")
    public ResponseEntity<List<LearningMaterial>> getContentByTopic(@PathVariable String topicId) {
        List<LearningMaterial> materials = contentService.getContentByTopic(topicId);
        return ResponseEntity.ok(materials);
    }

    @GetMapping("/search")
    public ResponseEntity<List<LearningMaterial>> searchContent(@RequestParam String query) {
        List<LearningMaterial> materials = contentService.searchContent(query);
        return ResponseEntity.ok(materials);
    }

    @PostMapping
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<?> createContent(@Valid @RequestBody LearningMaterialDto contentDto,
                                         @AuthenticationPrincipal UserDetails userDetails) {
        try {
            // In a real implementation, extract user ID from JWT token
            String createdBy = userDetails.getUsername(); // This would be user ID
            LearningMaterial material = contentService.createContent(contentDto, createdBy);
            return ResponseEntity.ok(material);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<?> updateContent(@PathVariable String id,
                                         @Valid @RequestBody LearningMaterialDto contentDto,
                                         @AuthenticationPrincipal UserDetails userDetails) {
        try {
            String userId = userDetails.getUsername(); // This would be user ID
            LearningMaterial material = contentService.updateContent(id, contentDto, userId);
            return ResponseEntity.ok(material);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteContent(@PathVariable String id,
                                         @AuthenticationPrincipal UserDetails userDetails) {
        try {
            String userId = userDetails.getUsername(); // This would be user ID
            boolean deleted = contentService.deleteContent(id, userId);
            return deleted ? ResponseEntity.ok().build() : ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/upload")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file,
                                      @AuthenticationPrincipal UserDetails userDetails) {
        try {
            String userId = userDetails.getUsername(); // This would be user ID
            String filePath = contentService.uploadFile(file, userId);
            return ResponseEntity.ok().body("File uploaded successfully: " + filePath);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/categories")
    public ResponseEntity<String[]> getCategories() {
        // Return available content types
        String[] categories = {"TEXT", "VIDEO", "INTERACTIVE_EXERCISE"};
        return ResponseEntity.ok(categories);
    }
}