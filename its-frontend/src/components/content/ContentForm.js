import React, { useState, useEffect } from 'react';
import { useContent } from '../../context/ContentContext';
import contentService from '../../services/contentService';

/**
 * Content Form Component following Single Responsibility Principle
 * Handles content creation and editing
 */
const ContentForm = ({ content, onClose, onSuccess }) => {
  const { createContent, updateContent, categories, fetchCategories } = useContent();
  const [formData, setFormData] = useState({
    title: '',
    type: 'TEXT',
    content: '',
    topicId: 'default-topic', // Simplified for demo
    published: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

  const isEditing = !!content;

  useEffect(() => {
    if (categories.length === 0) {
      fetchCategories();
    }
  }, [categories, fetchCategories]);

  useEffect(() => {
    if (content) {
      setFormData({
        title: content.title || '',
        type: content.type || 'TEXT',
        content: content.content || '',
        topicId: content.topicId || 'default-topic',
        published: content.published || false
      });
    }
  }, [content]);

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
            <option value="TEXT">Text</option>
            <option value="VIDEO">Video</option>
            <option value="INTERACTIVE_EXERCISE">Interactive Exercise</option>
          </select>
        </div>

        {formData.type === 'TEXT' && (
          <div className="form-group">
            <label htmlFor="content" className="form-label">Content *</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              className={`form-control ${errors.content ? 'error' : ''}`}
              placeholder="Enter your content here..."
              rows="6"
            />
            {errors.content && <div className="error">{errors.content}</div>}
          </div>
        )}

        {formData.type === 'VIDEO' && (
          <div className="form-group">
            <label htmlFor="videoFile" className="form-label">Video File *</label>
            <input
              type="file"
              id="videoFile"
              accept="video/*"
              onChange={handleFileUpload}
              className="form-control"
            />
            {uploadedFile && (
              <div className="success">File uploaded successfully!</div>
            )}
            {errors.file && <div className="error">{errors.file}</div>}
            {errors.content && <div className="error">{errors.content}</div>}
          </div>
        )}

        {formData.type === 'INTERACTIVE_EXERCISE' && (
          <div className="form-group">
            <label htmlFor="content" className="form-label">Exercise Configuration (JSON) *</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              className={`form-control ${errors.content ? 'error' : ''}`}
              placeholder="Enter exercise configuration in JSON format..."
              rows="8"
            />
            {errors.content && <div className="error">{errors.content}</div>}
          </div>
        )}

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="published"
              checked={formData.published}
              onChange={handleChange}
            />
            Publish immediately
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