import React, { useState, useEffect } from 'react';
import { useContent } from '../../context/ContentContext';
import contentService from '../../services/contentService';
import topicService from '../../services/topicService';
import courseService from '../../services/courseService';

/**
 * Content Form Component following Single Responsibility Principle
 * Handles content creation and editing
 */
const ContentForm = ({ content, onClose, onSuccess }) => {
  const { createContent, updateContent, categories, fetchCategories } = useContent();
  const [formData, setFormData] = useState({
    title: '',
    type: 'LECTURE',
    format: '',
    content: '',
    topicId: '',
    difficulty: 'BEGINNER',
    tags: [],
    published: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [courses, setCourses] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [difficultyLevels] = useState(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']);

  const isEditing = !!content;

  useEffect(() => {
    if (categories.length === 0) {
      fetchCategories();
    }
    fetchCourses();
  }, [categories, fetchCategories]);

  useEffect(() => {
    if (content) {
      setFormData({
        title: content.title || '',
        type: content.type || 'LECTURE',
        format: content.format || '',
        content: content.content || '',
        topicId: content.topicId || '',
        difficulty: content.difficulty || 'BEGINNER',
        tags: content.tags || [],
        published: content.published || false
      });
      
      // If editing, load the course and topics for the selected topic
      if (content.topicId) {
        loadCourseAndTopicsForContent(content.topicId);
      }
    }
  }, [content]);

  const loadCourseAndTopicsForContent = async (topicId) => {
    try {
      // Get the topic to find its courseId
      const allTopicsResponse = await topicService.getAllTopics();
      const topic = allTopicsResponse.data.find(t => t.id === topicId);
      
      if (topic && topic.courseId) {
        setSelectedCourse(topic.courseId);
        // Load topics for this course
        const topicsResponse = await topicService.getTopicsByCourse(topic.courseId);
        setTopics(topicsResponse.data || []);
      }
    } catch (error) {
      console.error('Error loading course and topics for content:', error);
    }
  };

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      // Get all courses (including unpublished) for instructors to choose from
      const response = await courseService.getAllCourses();
      
      console.log('Fetched courses:', response.data);
      setCourses(response.data || []);
      
      if (!response.data || response.data.length === 0) {
        console.warn('No courses found. User needs to create courses first.');
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses([]);
    }
  };

  const fetchTopicsByCourse = async (courseId) => {
    try {
      const response = await topicService.getTopicsByCourse(courseId);
      setTopics(response.data || []);
    } catch (error) {
      console.error('Error fetching topics:', error);
      setTopics([]);
    }
  };

  const handleCourseChange = (courseId) => {
    setSelectedCourse(courseId);
    setFormData(prev => ({ ...prev, topicId: '' })); // Reset topic when course changes
    if (courseId) {
      fetchTopicsByCourse(courseId);
    } else {
      setTopics([]);
    }
  };

  const getAcceptedFileTypes = () => {
    const format = formData.format;
    const fileTypeMap = {
      'PDF': '.pdf,application/pdf',
      'WORD': '.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'POWERPOINT': '.ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'IMAGE_PNG': '.png,image/png',
      'IMAGE_JPG': '.jpg,.jpeg,image/jpeg',
      'IMAGE_GIF': '.gif,image/gif',
      'IMAGE_SVG': '.svg,image/svg+xml',
      'VIDEO_MP4': '.mp4,video/mp4',
      'VIDEO_WEBM': '.webm,video/webm',
      'VIDEO_AVI': '.avi,video/x-msvideo',
      'AUDIO_MP3': '.mp3,audio/mpeg',
      'AUDIO_WAV': '.wav,audio/wav',
      'ZIP': '.zip,application/zip',
      'HTML': '.html,.htm,text/html',
      'MARKDOWN': '.md,.markdown,text/markdown'
    };
    return fileTypeMap[format] || '*';
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsLoading(true);
      const response = await contentService.uploadFile(file);
      setUploadedFile(response.data);
      setFormData(prev => ({
        ...prev,
        content: response.data // Set file path as content for video type
      }));
    } catch (error) {
      setErrors({ file: 'Failed to upload file' });
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.topicId) {
      newErrors.topicId = 'Please select a topic';
    }

    if (formData.type === 'TEXT' && !formData.content.trim()) {
      newErrors.content = 'Content is required';
    }

    if (formData.type === 'VIDEO' && !formData.content && !uploadedFile) {
      newErrors.content = 'Video file is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      let result;
      if (isEditing) {
        result = await updateContent(content.id, formData);
      } else {
        result = await createContent(formData);
      }
      
      if (result.success) {
        onSuccess();
      } else {
        setErrors({ general: result.message });
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="content-form">
      <div className="form-header">
        <h3>{isEditing ? 'Edit Content' : 'Create New Content'}</h3>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>

      {errors.general && <div className="error">{errors.general}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title" className="form-label">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`form-control ${errors.title ? 'error' : ''}`}
            placeholder="Enter content title"
          />
          {errors.title && <div className="error">{errors.title}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="type" className="form-label">Content Type *</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="form-control"
          >
            <option value="LECTURE">Lecture</option>
            <option value="VIDEO">Video</option>
            <option value="QUIZ">Quiz</option>
            <option value="EXERCISE">Exercise</option>
            <option value="READING">Reading</option>
            <option value="ASSIGNMENT">Assignment</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="format" className="form-label">File Format</label>
          <select
            id="format"
            name="format"
            value={formData.format}
            onChange={handleChange}
            className="form-control"
          >
            <option value="">No file / Text only</option>
            <optgroup label="Documents">
              <option value="PDF">PDF Document</option>
              <option value="WORD">Word Document (.docx)</option>
            </optgroup>
            <optgroup label="Presentations">
              <option value="POWERPOINT">PowerPoint (.pptx)</option>
            </optgroup>
            <optgroup label="Images">
              <option value="IMAGE_PNG">PNG Image</option>
              <option value="IMAGE_JPG">JPEG Image</option>
              <option value="IMAGE_GIF">GIF Image</option>
              <option value="IMAGE_SVG">SVG Image</option>
            </optgroup>
            <optgroup label="Videos">
              <option value="VIDEO_MP4">MP4 Video</option>
              <option value="VIDEO_WEBM">WebM Video</option>
              <option value="VIDEO_AVI">AVI Video</option>
            </optgroup>
            <optgroup label="Audio">
              <option value="AUDIO_MP3">MP3 Audio</option>
              <option value="AUDIO_WAV">WAV Audio</option>
            </optgroup>
            <optgroup label="Other">
              <option value="ZIP">ZIP Archive</option>
              <option value="HTML">HTML Document</option>
              <option value="MARKDOWN">Markdown</option>
            </optgroup>
          </select>
          <small style={{ color: '#64748b', fontSize: '13px', marginTop: '6px', display: 'block' }}>
            Select a file format if you plan to upload a file
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="course" className="form-label">Course *</label>
          <select
            id="course"
            value={selectedCourse}
            onChange={(e) => handleCourseChange(e.target.value)}
            className="form-control"
            required
          >
            <option value="">Select a course...</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>{course.title}</option>
            ))}
          </select>
          {courses.length === 0 && (
            <small style={{ color: '#dc3545', fontSize: '13px', marginTop: '6px', display: 'block' }}>
              No courses available. Please create a course first in "Manage Content" section.
            </small>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="topicId" className="form-label">Topic *</label>
          <select
            id="topicId"
            name="topicId"
            value={formData.topicId}
            onChange={handleChange}
            className="form-control"
            required
            disabled={!selectedCourse}
          >
            <option value="">Select a topic...</option>
            {topics.map(topic => (
              <option key={topic.id} value={topic.id}>{topic.name}</option>
            ))}
          </select>
          {!selectedCourse && (
            <small style={{ color: '#64748b', fontSize: '13px', marginTop: '6px', display: 'block' }}>
              Please select a course first.
            </small>
          )}
          {selectedCourse && topics.length === 0 && (
            <small style={{ color: '#dc3545', fontSize: '13px', marginTop: '6px', display: 'block' }}>
              No topics found for this course. Create topics in "Manage Content" section.
            </small>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="difficulty" className="form-label">Difficulty Level *</label>
          <select
            id="difficulty"
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            className="form-control"
          >
            {difficultyLevels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>

        {/* Show file upload if a file format is selected */}
        {formData.format && formData.format !== '' ? (
          <div className="form-group">
            <label htmlFor="fileUpload" className="form-label">Upload File *</label>
            <input
              type="file"
              id="fileUpload"
              accept={getAcceptedFileTypes()}
              onChange={handleFileUpload}
              className="form-control"
            />
            {uploadedFile && (
              <div className="success">✓ File uploaded successfully: {uploadedFile.name}</div>
            )}
            {errors.file && <div className="error">{errors.file}</div>}
            {errors.content && <div className="error">{errors.content}</div>}
            <small style={{ color: '#64748b', fontSize: '13px', marginTop: '6px', display: 'block' }}>
              Selected format: {formData.format.replace(/_/g, ' ')}
            </small>
          </div>
        ) : (
          /* Show textarea for text-based content types without file format */
          <div className="form-group">
            <label htmlFor="content" className="form-label">Content *</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              className={`form-control ${errors.content ? 'error' : ''}`}
              placeholder="Enter your content here..."
              rows="8"
            />
            {errors.content && <div className="error">{errors.content}</div>}
            <small style={{ color: '#64748b', fontSize: '13px', marginTop: '6px', display: 'block' }}>
              Enter text content or select a file format above to upload a file instead.
            </small>
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Tags (Optional)</label>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              placeholder="Add a tag..."
              className="form-control"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="btn btn-secondary"
              style={{ whiteSpace: 'nowrap' }}
            >
              + Add
            </button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {formData.tags.map(tag => (
              <span
                key={tag}
                style={{
                  padding: '6px 12px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  style={{
                    background: 'rgba(255,255,255,0.3)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    cursor: 'pointer',
                    color: 'white',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 0
                  }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="checkbox-label" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            padding: '10px 0',
            fontSize: '15px',
            fontWeight: '500',
            color: '#2d3748'
          }}>
            <input
              type="checkbox"
              name="published"
              checked={formData.published}
              onChange={handleChange}
              style={{
                width: '20px',
                height: '20px',
                cursor: 'pointer',
                accentColor: '#667eea'
              }}
            />
            <span>Publish immediately</span>
          </label>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : (isEditing ? 'Update' : 'Create')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContentForm;