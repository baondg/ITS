package com.its.domain.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import com.its.domain.entities.ContentType;
import com.its.domain.entities.FileFormat;
import com.its.domain.entities.DifficultyLevel;

import java.util.List;

/**
 * Learning Material DTO for API requests
 */
public class LearningMaterialDto {
    
    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    private String title;
    
    @NotBlank(message = "Content type is required")
    private String type;
    
    private String format; // File format (PDF, DOCX, MP4, etc.)
    
    private String content;
    
    @NotBlank(message = "Topic ID is required")
    private String topicId;
    
    private String difficulty; // BEGINNER, INTERMEDIATE, ADVANCED, EXPERT
    private List<String> tags;
    
    private boolean published;

    public LearningMaterialDto() {}

    // Getters and setters
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getFormat() {
        return format;
    }

    public void setFormat(String format) {
        this.format = format;
    }

    public FileFormat getFileFormat() {
        if (format == null || format.isEmpty()) {
            return null;
        }
        try {
            return FileFormat.valueOf(format.toUpperCase().replace(" ", "_"));
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getTopicId() {
        return topicId;
    }

    public void setTopicId(String topicId) {
        this.topicId = topicId;
    }

    public boolean isPublished() {
        return published;
    }

    public void setPublished(boolean published) {
        this.published = published;
    }

    public ContentType getContentType() {
        try {
            return ContentType.valueOf(type.toUpperCase().replace(" ", "_"));
        } catch (IllegalArgumentException e) {
            return ContentType.LECTURE;
        }
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public DifficultyLevel getDifficultyLevel() {
        if (difficulty == null || difficulty.isEmpty()) {
            return null;
        }
        try {
            return DifficultyLevel.valueOf(difficulty.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }
}