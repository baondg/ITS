package com.its.application.controllers;

import com.its.domain.entities.Course;
import com.its.domain.entities.DifficultyLevel;
import com.its.persistence.repositories.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Course Controller for managing courses
 */
@RestController
@RequestMapping("/courses")
@CrossOrigin(origins = "http://localhost:3000")
public class CourseController {

    private final CourseRepository courseRepository;

    @Autowired
    public CourseController(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    @GetMapping
    public ResponseEntity<List<Course>> getAllCourses() {
        List<Course> courses = courseRepository.findAll();
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable String id) {
        return courseRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/published")
    public ResponseEntity<List<Course>> getPublishedCourses() {
        List<Course> courses = courseRepository.findByPublished(true);
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/difficulty/{level}")
    public ResponseEntity<List<Course>> getCoursesByDifficulty(@PathVariable String level) {
        try {
            DifficultyLevel difficulty = DifficultyLevel.valueOf(level.toUpperCase());
            List<Course> courses = courseRepository.findByDifficulty(difficulty);
            return ResponseEntity.ok(courses);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/subject/{subject}")
    public ResponseEntity<List<Course>> getCoursesBySubject(@PathVariable String subject) {
        List<Course> courses = courseRepository.findBySubject(subject);
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Course>> searchCourses(@RequestParam String query) {
        List<Course> courses = courseRepository.findByTitleContainingIgnoreCase(query);
        return ResponseEntity.ok(courses);
    }

    @PostMapping
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<?> createCourse(@RequestBody Course course,
                                         @AuthenticationPrincipal UserDetails userDetails) {
        try {
            course.setCreatedBy(userDetails.getUsername());
            Course savedCourse = courseRepository.save(course);
            return ResponseEntity.ok(savedCourse);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<?> updateCourse(@PathVariable String id,
                                         @RequestBody Course courseUpdate,
                                         @AuthenticationPrincipal UserDetails userDetails) {
        return courseRepository.findById(id)
                .map(course -> {
                    String userId = userDetails.getUsername();
                    // Check if user owns the course or is admin
                    if (!course.getCreatedBy().equals(userId)) {
                        return ResponseEntity.status(403).body("Unauthorized to update this course");
                    }
                    
                    course.setTitle(courseUpdate.getTitle());
                    course.setDescription(courseUpdate.getDescription());
                    course.setSubject(courseUpdate.getSubject());
                    course.setDifficulty(courseUpdate.getDifficulty());
                    course.setPublished(courseUpdate.isPublished());
                    
                    Course savedCourse = courseRepository.save(course);
                    return ResponseEntity.ok(savedCourse);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteCourse(@PathVariable String id,
                                         @AuthenticationPrincipal UserDetails userDetails) {
        return courseRepository.findById(id)
                .map(course -> {
                    String userId = userDetails.getUsername();
                    if (!course.getCreatedBy().equals(userId)) {
                        return ResponseEntity.status(403).body("Unauthorized to delete this course");
                    }
                    
                    courseRepository.delete(course);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/my-courses")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<List<Course>> getMyCourses(@AuthenticationPrincipal UserDetails userDetails) {
        List<Course> courses = courseRepository.findByCreatedBy(userDetails.getUsername());
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/difficulty-levels")
    public ResponseEntity<DifficultyLevel[]> getDifficultyLevels() {
        return ResponseEntity.ok(DifficultyLevel.values());
    }
}
