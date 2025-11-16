package com.its.domain.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import com.its.domain.entities.ContentType;

/**
 * Learning Material DTO for API requests
 */
public class LearningMaterialDto {
    
    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    private String title;
    
    @NotBlank(message = "Content type is required")
    private String type;
    
    private String content;
    
    @NotBlank(message = "Topic ID is required")
    private String topicId;
    
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
            return ContentType.TEXT;
        }
    }
}