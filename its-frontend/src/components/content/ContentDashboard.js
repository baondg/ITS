import React, { useState, useEffect } from 'react';
import { useContent } from '../../context/ContentContext';
import { useAuth } from '../../context/AuthContext';
import ContentForm from './ContentForm';
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
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingContent, setEditingContent] = useState(null);

  useEffect(() => {
    fetchAllContent();
    fetchCategories();
  }, []);

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
    return user.role === 'ADMIN' || 
           (user.role === 'INSTRUCTOR' && content.createdBy === user.id);
  };

  const canCreateContent = () => {
    return user && (user.role === 'INSTRUCTOR' || user.role === 'ADMIN');
  };

  const filteredContents = filterType 
    ? contents.filter(content => content.type === filterType)
    : contents;

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
      </div>

      {/* Content Grid */}
      <div className="content-grid">
        {filteredContents.length > 0 ? (
          filteredContents.map(content => (
            <div key={content.id} className="content-card">
              <div className="content-header">
                <h3>{content.title}</h3>
                <span className={`content-type ${content.type.toLowerCase()}`}>
                  {content.type.replace('_', ' ')}
                </span>
              </div>
              
              <div className="content-body">
                {content.type === 'TEXT' && (
                  <p className="content-preview">
                    {content.content?.substring(0, 150)}...
                  </p>
                )}
                {content.type === 'VIDEO' && (
                  <div className="video-placeholder">
                    📹 Video Content
                  </div>
                )}
                {content.type === 'INTERACTIVE_EXERCISE' && (
                  <div className="exercise-placeholder">
                    🎯 Interactive Exercise
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