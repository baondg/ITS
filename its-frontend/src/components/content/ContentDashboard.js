import React, { useState, useEffect } from 'react';
import { useContent } from '../../context/ContentContext';
import { useAuth } from '../../context/AuthContext';
import ContentForm from './ContentForm';
import courseService from '../../services/courseService';
import topicService from '../../services/topicService';
import './content.css';

/**
 * Content Dashboard Component following Single Responsibility Principle
 * Manages content display and operations
 */
const ContentDashboard = () => {
  const { 
    contents, 
    categories, 
    isLoading, 
    fetchAllContent, 
    searchContent,
    deleteContent,
    fetchCategories 
  } = useContent();
  
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [courses, setCourses] = useState([]);
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    fetchAllContent();
    fetchCategories();
    fetchCoursesAndTopics();
  }, []);

  const fetchCoursesAndTopics = async () => {
    try {
      const [coursesRes, topicsRes] = await Promise.all([
        courseService.getAllCourses(),
        topicService.getAllTopics()
      ]);
      setCourses(coursesRes.data || []);
      setTopics(topicsRes.data || []);
    } catch (error) {
      console.error('Error fetching courses and topics:', error);
    }
  };

  const getCourseName = (topicId) => {
    const topic = topics.find(t => t.id === topicId);
    if (!topic) return 'N/A';
    const course = courses.find(c => c.id === topic.courseId);
    return course ? course.title : 'Unknown Course';
  };

  const getTopicName = (topicId) => {
    const topic = topics.find(t => t.id === topicId);
    return topic ? topic.name : 'Unknown Topic';
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      await searchContent(searchQuery);
    } else {
      await fetchAllContent();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      const result = await deleteContent(id);
      if (result.success) {
        // Content already removed from state by context
      } else {
        alert(result.message);
      }
    }
  };

  const canEditContent = (content) => {
    if (!user) return false;
    // Check if user is admin or the content creator
    // createdBy might be either user.id or user.email depending on backend implementation
    return user.role === 'ADMIN' || 
           (user.role === 'INSTRUCTOR' && 
            (content.createdBy === user.id || content.createdBy === user.email));
  };

  const canCreateContent = () => {
    return user && (user.role === 'INSTRUCTOR' || user.role === 'ADMIN');
  };

  const filteredContents = contents.filter(content => {
    if (filterType && content.type !== filterType) return false;
    if (filterDifficulty && content.difficulty !== filterDifficulty) return false;
    return true;
  });

  if (isLoading) {
    return <div className="loading">Loading content...</div>;
  }

  return (
    <div className="content-dashboard">
      <div className="dashboard-header">
        <h2>Learning Content</h2>
        {canCreateContent() && (
          <button
            className="btn btn-primary"
            onClick={() => setShowCreateForm(true)}
          >
            Create New Content
          </button>
        )}
      </div>

      {/* Search and Filter Section */}
      <div className="content-controls">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-control search-input"
          />
          <button type="submit" className="btn btn-secondary">
            Search
          </button>
        </form>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="form-control filter-select"
        >
          <option value="">All Types</option>
          {categories.map(category => (
            <option key={category} value={category}>
              {category.replace('_', ' ')}
            </option>
          ))}
        </select>

        <select
          value={filterDifficulty}
          onChange={(e) => setFilterDifficulty(e.target.value)}
          className="form-control filter-select"
        >
          <option value="">All Difficulties</option>
          <option value="BEGINNER">Beginner</option>
          <option value="INTERMEDIATE">Intermediate</option>
          <option value="ADVANCED">Advanced</option>
          <option value="EXPERT">Expert</option>
        </select>
      </div>

      {/* Content Grid */}
      <div className="content-grid">
        {filteredContents.length > 0 ? (
          filteredContents.map(content => (
            <div key={content.id} className="content-card">
              <div className="content-header">
                <h3>{content.title}</h3>
                <div className="header-badges">
                  <span className={`content-type ${content.type.toLowerCase()}`}>
                    {content.type.replace('_', ' ')}
                  </span>
                  {content.difficulty && (
                    <span className={`difficulty-badge badge-${content.difficulty.toLowerCase()}`}>
                      {content.difficulty}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="content-body">
                <div className="content-metadata">
                  <div className="metadata-item">
                    <span className="metadata-label">📚 Course:</span>
                    <span className="metadata-value">{getCourseName(content.topicId)}</span>
                  </div>
                  <div className="metadata-item">
                    <span className="metadata-label">📖 Topic:</span>
                    <span className="metadata-value">{getTopicName(content.topicId)}</span>
                  </div>
                  <div className="metadata-item">
                    <span className="metadata-label">📝 Type:</span>
                    <span className="metadata-value">{content.type.replace('_', ' ')}</span>
                  </div>
                </div>
                
                {(content.type === 'LECTURE' || content.type === 'READING') && (
                  <p className="content-preview">
                    {content.content?.substring(0, 150)}...
                  </p>
                )}
                {content.type === 'VIDEO' && (
                  <div className="video-placeholder">
                    📹 Video Content
                  </div>
                )}
                {content.type === 'QUIZ' && (
                  <div className="quiz-placeholder">
                    📝 Quiz
                  </div>
                )}
                {content.type === 'EXERCISE' && (
                  <div className="exercise-placeholder">
                    🎯 Exercise
                  </div>
                )}
                {content.type === 'ASSIGNMENT' && (
                  <div className="assignment-placeholder">
                    📋 Assignment
                  </div>
                )}
                {content.type === 'INTERACTIVE_EXERCISE' && (
                  <div className="exercise-placeholder">
                    🎯 Interactive Exercise
                  </div>
                )}
                
                {content.tags && content.tags.length > 0 && (
                  <div className="content-tags">
                    {content.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                    {content.tags.length > 3 && (
                      <span className="tag">+{content.tags.length - 3}</span>
                    )}
                  </div>
                )}
              </div>
              
              <div className="content-footer">
                <div className="content-meta">
                  <span className="created-date">
                    {new Date(content.createdDate).toLocaleDateString()}
                  </span>
                  <span className={`status ${content.published ? 'published' : 'draft'}`}>
                    {content.published ? 'Published' : 'Draft'}
                  </span>
                </div>
                
                {canEditContent(content) && (
                  <div className="content-actions">
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => setEditingContent(content)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(content.id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
                
                {!canEditContent(content) && (
                  <div style={{fontSize: '12px', color: '#999'}}>
                    Read-only
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="no-content">
            <p>No content found.</p>
            {canCreateContent() && (
              <button
                className="btn btn-primary"
                onClick={() => setShowCreateForm(true)}
              >
                Create Your First Content
              </button>
            )}
          </div>
        )}
      </div>

      {/* Create/Edit Form Modal */}
      {(showCreateForm || editingContent) && (
        <div className="modal-overlay">
          <div className="modal-content">
            <ContentForm
              content={editingContent}
              onClose={() => {
                setShowCreateForm(false);
                setEditingContent(null);
              }}
              onSuccess={() => {
                setShowCreateForm(false);
                setEditingContent(null);
                fetchAllContent();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentDashboard;