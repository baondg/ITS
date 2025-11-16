package com.its.domain.entities;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;

/**
 * Topic entity following Single Responsibility Principle
 */
@Document(collection = "topics")
public class Topic {
    @Id
    private String id;
    
    @Indexed
    private String name;
    
    private String description;
    
    @Indexed
    private String courseId; // Course reference
    
    @CreatedDate
    private LocalDateTime createdDate;
    
    @LastModifiedDate
    private LocalDateTime lastModifiedDate;

    public Topic() {}

    public Topic(String name, String description, String courseId) {
        this.name = name;
        this.description = description;
        this.courseId = courseId;
    }

    // Getters and setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCourseId() {
        return courseId;
    }

    public void setCourseId(String courseId) {
        this.courseId = courseId;
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
}