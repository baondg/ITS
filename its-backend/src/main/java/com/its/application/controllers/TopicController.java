package com.its.application.controllers;

import com.its.domain.entities.Topic;
import com.its.persistence.repositories.TopicRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Topic Controller for managing topics within courses
 */
@RestController
@RequestMapping("/topics")
@CrossOrigin(origins = "http://localhost:3000")
public class TopicController {

    private final TopicRepository topicRepository;

    @Autowired
    public TopicController(TopicRepository topicRepository) {
        this.topicRepository = topicRepository;
    }

    @GetMapping
    public ResponseEntity<List<Topic>> getAllTopics() {
        List<Topic> topics = topicRepository.findAll();
        return ResponseEntity.ok(topics);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Topic> getTopicById(@PathVariable String id) {
        return topicRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Topic>> getTopicsByCourse(@PathVariable String courseId) {
        List<Topic> topics = topicRepository.findByCourseId(courseId);
        return ResponseEntity.ok(topics);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Topic>> searchTopics(@RequestParam String query) {
        List<Topic> topics = topicRepository.findByNameContainingIgnoreCase(query);
        return ResponseEntity.ok(topics);
    }

    @PostMapping
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<?> createTopic(@RequestBody Topic topic) {
        try {
            Topic savedTopic = topicRepository.save(topic);
            return ResponseEntity.ok(savedTopic);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<?> updateTopic(@PathVariable String id,
                                        @RequestBody Topic topicUpdate) {
        return topicRepository.findById(id)
                .map(topic -> {
                    topic.setName(topicUpdate.getName());
                    topic.setDescription(topicUpdate.getDescription());
                    topic.setCourseId(topicUpdate.getCourseId());
                    
                    Topic savedTopic = topicRepository.save(topic);
                    return ResponseEntity.ok(savedTopic);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteTopic(@PathVariable String id) {
        return topicRepository.findById(id)
                .map(topic -> {
                    topicRepository.delete(topic);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
