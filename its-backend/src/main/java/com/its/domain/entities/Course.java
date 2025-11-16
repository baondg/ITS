package com.its.domain.entities;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;

/**
 * Course entity following Single Responsibility Principle
 */
@Document(collection = "courses")
public class Course {
    @Id
    private String id;
    
    @Indexed
    private String title;
    
    private String description;
    private String subject;
    private DifficultyLevel difficulty;
    
    @Indexed
    private String createdBy; // Instructor ID
    
    @CreatedDate
    private LocalDateTime createdDate;
    
    @LastModifiedDate
    private LocalDateTime lastModifiedDate;
    
    private boolean published = false;

    public Course() {}

    public Course(String title, String description, String subject, DifficultyLevel difficulty, String createdBy) {
        this.title = title;
        this.description = description;
        this.subject = subject;
        this.difficulty = difficulty;
        this.createdBy = createdBy;
    }

    // Getters and setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public DifficultyLevel getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(DifficultyLevel difficulty) {
        this.difficulty = difficulty;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }

    public LocalDateTime getLastModifiedDate() {
        return lastModifiedDate;
    }

    public void setLastModifiedDate(LocalDateTime lastModifiedDate) {
        this.lastModifiedDate = lastModifiedDate;
    }

    public boolean isPublished() {
        return published;
    }

    public void setPublished(boolean published) {
        this.published = published;
    }
}