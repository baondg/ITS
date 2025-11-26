import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import courseService from '../../services/courseService';
import topicService from '../../services/topicService';
import './ManageContent.css';

const ManageContent = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('courses');
  const [courses, setCourses] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showTopicForm, setShowTopicForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const difficultyLevels = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'];
  
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    subject: '',
    difficulty: 'BEGINNER',
    published: false
  });
  
  const [topicForm, setTopicForm] = useState({
    name: '',
    description: '',
    courseId: '',
    published: false
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      // Always fetch courses since they're needed for topic form
      const coursesResponse = await courseService.getMyCourses(token);
      setCourses(coursesResponse.data);
      
      if (activeTab === 'topics') {
        const topicsResponse = await topicService.getAllTopics();
        setTopics(topicsResponse.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (selectedCourse) {
        await courseService.updateCourse(selectedCourse.id, courseForm, token);
      } else {
        await courseService.createCourse(courseForm, token);
      }
      setShowCourseForm(false);
      setSelectedCourse(null);
      resetCourseForm();
      fetchData();
    } catch (error) {
      console.error('Error saving course:', error);
      alert('Failed to save course');
    }
    setLoading(false);
  };

  const handleTopicSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (selectedCourse) {
        topicForm.courseId = selectedCourse.id;
      }
      await topicService.createTopic(topicForm, token);
      setShowTopicForm(false);
      resetTopicForm();
      fetchData();
    } catch (error) {
      console.error('Error saving topic:', error);
      alert('Failed to save topic');
    }
    setLoading(false);
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await courseService.deleteCourse(id, token);
      fetchData();
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Failed to delete course');
    }
  };

  const handleDeleteTopic = async (id) => {
    if (!window.confirm('Are you sure you want to delete this topic?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await topicService.deleteTopic(id, token);
      fetchData();
    } catch (error) {
      console.error('Error deleting topic:', error);
      alert('Failed to delete topic');
    }
  };

  const handleEditCourse = (course) => {
    setSelectedCourse(course);
    setCourseForm({
      title: course.title,
      description: course.description,
      subject: course.subject,
      difficulty: course.difficulty,
      published: course.published
    });
    setShowCourseForm(true);
  };

  const resetCourseForm = () => {
    setCourseForm({
      title: '',
      description: '',
      subject: '',
      difficulty: 'BEGINNER',
      published: false
    });
  };

  const resetTopicForm = () => {
    setTopicForm({
      name: '',
      description: '',
      courseId: '',
      published: false
    });
  };

  const getCourseName = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.title : 'Unknown Course';
  };

  const getDifficultyBadgeClass = (difficulty) => {
    const classes = {
      BEGINNER: 'badge-beginner',
      INTERMEDIATE: 'badge-intermediate',
      ADVANCED: 'badge-advanced',
      EXPERT: 'badge-expert'
    };
    return classes[difficulty] || 'badge-beginner';
  };

  return (
    <div className="manage-content-page">
      <div className="page-header">
        <h2>📚 Manage Learning Content</h2>
        <p>Organize your courses, topics, and learning materials</p>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'courses' ? 'active' : ''}`}
          onClick={() => setActiveTab('courses')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Courses
        </button>
        <button
          className={`tab ${activeTab === 'topics' ? 'active' : ''}`}
          onClick={() => setActiveTab('topics')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M3 3h18v18H3z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 9h6M9 15h6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Topics
        </button>
      </div>

      <div className="content-section">
        {activeTab === 'courses' && (
          <div>
            <div className="section-header">
              <h3>My Courses</h3>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setSelectedCourse(null);
                  resetCourseForm();
                  setShowCourseForm(true);
                }}
              >
                + Create Course
              </button>
            </div>

            {loading ? (
              <div className="loading">Loading courses...</div>
            ) : (
              <div className="course-grid">
                {courses.length > 0 ? (
                  courses.map(course => (
                    <div key={course.id} className="course-card">
                      <div className="card-header">
                        <h4>{course.title}</h4>
                        <span className={`difficulty-badge ${getDifficultyBadgeClass(course.difficulty)}`}>
                          {course.difficulty}
                        </span>
                      </div>
                      <p className="course-description">{course.description}</p>
                      <div className="course-meta">
                        <span className="subject-tag">📖 {course.subject}</span>
                        <span className={`status-badge ${course.published ? 'published' : 'draft'}`}>
                          {course.published ? '✓ Published' : '📝 Draft'}
                        </span>
                      </div>
                      <div className="card-actions">
                        <button
                          className="btn-icon btn-edit"
                          onClick={() => handleEditCourse(course)}
                          title="Edit Course"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-icon btn-topics"
                          onClick={() => {
                            setSelectedCourse(course);
                            setShowTopicForm(true);
                          }}
                          title="Add Topics"
                        >
                          ➕
                        </button>
                        <button
                          className="btn-icon btn-delete"
                          onClick={() => handleDeleteCourse(course.id)}
                          title="Delete Course"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <p>No courses yet. Create your first course to get started!</p>
                    <button
                      className="btn btn-primary"
                      onClick={() => setShowCourseForm(true)}
                    >
                      Create Your First Course
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'topics' && (
          <div>
            <div className="section-header">
              <h3>All Topics</h3>
              <button
                className="btn btn-primary"
                onClick={() => setShowTopicForm(true)}
              >
                + Create Topic
              </button>
            </div>

            {loading ? (
              <div className="loading">Loading topics...</div>
            ) : (
              <div className="topic-list">
                {topics.length > 0 ? (
                  topics.map(topic => (
                    <div key={topic.id} className="topic-item">
                      <div className="topic-content">
                        <h4>{topic.name}</h4>
                        <p>{topic.description}</p>
                        <span className="topic-course">
                          📚 Course: <strong>{getCourseName(topic.courseId)}</strong>
                        </span>
                      </div>
                      <div className="topic-actions">
                        <button
                          className="btn-icon btn-delete"
                          onClick={() => handleDeleteTopic(topic.id)}
                          title="Delete Topic"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <p>No topics yet. Create topics to organize your content!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Course Form Modal */}
      {showCourseForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{selectedCourse ? 'Edit Course' : 'Create New Course'}</h3>
              <button className="close-btn" onClick={() => {
                setShowCourseForm(false);
                setSelectedCourse(null);
              }}>×</button>
            </div>
            <form onSubmit={handleCourseSubmit} className="form">
              <div className="form-group">
                <label>Course Title *</label>
                <input
                  type="text"
                  value={courseForm.title}
                  onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                  required
                  placeholder="e.g., Introduction to Data Structures"
                />
              </div>
              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  required
                  placeholder="Describe what students will learn..."
                  rows="4"
                />
              </div>
              <div className="form-group">
                <label>Subject *</label>
                <input
                  type="text"
                  value={courseForm.subject}
                  onChange={(e) => setCourseForm({ ...courseForm, subject: e.target.value })}
                  required
                  placeholder="e.g., Computer Science, Mathematics"
                />
              </div>
              <div className="form-group">
                <label>Difficulty Level *</label>
                <select
                  value={courseForm.difficulty}
                  onChange={(e) => setCourseForm({ ...courseForm, difficulty: e.target.value })}
                  required
                >
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                  <option value="EXPERT">Expert</option>
                </select>
              </div>
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={courseForm.published}
                    onChange={(e) => setCourseForm({ ...courseForm, published: e.target.checked })}
                  />
                  Publish course immediately
                </label>
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => {
                  setShowCourseForm(false);
                  setSelectedCourse(null);
                }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : (selectedCourse ? 'Update Course' : 'Create Course')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Topic Form Modal */}
      {showTopicForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Create New Topic</h3>
              <button className="close-btn" onClick={() => setShowTopicForm(false)}>×</button>
            </div>
            <form onSubmit={handleTopicSubmit} className="form">
              <div className="form-group">
                <label>Topic Name *</label>
                <input
                  type="text"
                  value={topicForm.name}
                  onChange={(e) => setTopicForm({ ...topicForm, name: e.target.value })}
                  required
                  placeholder="e.g., Arrays and Linked Lists"
                />
              </div>
              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={topicForm.description}
                  onChange={(e) => setTopicForm({ ...topicForm, description: e.target.value })}
                  required
                  placeholder="Describe this topic..."
                  rows="4"
                />
              </div>
              {!selectedCourse && (
                <div className="form-group">
                  <label>Course *</label>
                  <select
                    value={topicForm.courseId}
                    onChange={(e) => setTopicForm({ ...topicForm, courseId: e.target.value })}
                    required
                  >
                    <option value="">Select a course...</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>{course.title}</option>
                    ))}
                  </select>
                  {courses.length === 0 && (
                    <small style={{ color: '#dc3545', fontSize: '13px', marginTop: '6px', display: 'block' }}>
                      No courses available. Please create a course first.
                    </small>
                  )}
                </div>
              )}
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={topicForm.published}
                    onChange={(e) => setTopicForm({ ...topicForm, published: e.target.checked })}
                  />
                  Publish topic immediately
                </label>
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowTopicForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Topic'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageContent;
