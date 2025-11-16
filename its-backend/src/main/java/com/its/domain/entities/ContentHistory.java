package com.its.domain.entities;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

/**
 * Content History entity for version tracking
 */
@Document(collection = "content_history")
public class ContentHistory {
    @Id
    private String id;
    
    private String materialId; // Reference to LearningMaterial
    
    private String title;
    private String content;
    private String changeDescription;
    private String changedBy;
    
    @CreatedDate
    private LocalDateTime changeDate;
    
    private int version;

    public ContentHistory() {}

    public ContentHistory(String materialId, String title, String content, 
                         String changeDescription, String changedBy, int version) {
        this.materialId = materialId;
        this.title = title;
        this.content = content;
        this.changeDescription = changeDescription;
        this.changedBy = changedBy;
        this.version = version;
    }

    // Getters and setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getMaterialId() {
        return materialId;
    }

    public void setMaterialId(String materialId) {
        this.materialId = materialId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getChangeDescription() {
        return changeDescription;
    }

    public void setChangeDescription(String changeDescription) {
        this.changeDescription = changeDescription;
    }

    public String getChangedBy() {
        return changedBy;
    }

    public void setChangedBy(String changedBy) {
        this.changedBy = changedBy;
    }

    public LocalDateTime getChangeDate() {
        return changeDate;
    }

    public void setChangeDate(LocalDateTime changeDate) {
        this.changeDate = changeDate;
    }

    public int getVersion() {
        return version;
    }

    public void setVersion(int version) {
        this.version = version;
    }
}