import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import './auth.css';

/**
 * Profile Component for viewing and editing user profile
 * Following Single Responsibility Principle
 */
const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    bio: user?.bio || '',
    expertise: user?.expertise || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        'http://localhost:8080/api/auth/profile',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data) {
        updateUser(response.data);
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      bio: user?.bio || '',
      expertise: user?.expertise || ''
    });
    setIsEditing(false);
    setError('');
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            <span className="avatar-text">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </span>
          </div>
          <h2>{user?.firstName} {user?.lastName}</h2>
          <p className="profile-role">{user?.role}</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {!isEditing ? (
          <div className="profile-view">
            <div className="profile-section">
              <h3>Personal Information</h3>
              <div className="profile-field">
                <label>Email:</label>
                <span>{user?.email}</span>
              </div>
              <div className="profile-field">
                <label>First Name:</label>
                <span>{user?.firstName || 'Not set'}</span>
              </div>
              <div className="profile-field">
                <label>Last Name:</label>
                <span>{user?.lastName || 'Not set'}</span>
              </div>
              {user?.role === 'INSTRUCTOR' && (
                <>
                  <div className="profile-field">
                    <label>Expertise:</label>
                    <span>{user?.expertise || 'Not set'}</span>
                  </div>
                  <div className="profile-field">
                    <label>Bio:</label>
                    <span>{user?.bio || 'Not set'}</span>
                  </div>
                </>
              )}
            </div>
            
            <button 
              className="btn btn-primary btn-full-width"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="profile-edit">
            <div className="profile-section">
              <h3>Edit Information</h3>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="input-disabled"
                />
                <small className="form-hint">Email cannot be changed</small>
              </div>

              <div className="form-group">
                <label htmlFor="firstName">First Name *</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Last Name *</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>

              {user?.role === 'INSTRUCTOR' && (
                <>
                  <div className="form-group">
                    <label htmlFor="expertise">Expertise</label>
                    <input
                      type="text"
                      id="expertise"
                      name="expertise"
                      value={formData.expertise}
                      onChange={handleChange}
                      placeholder="e.g., Data Structures, Algorithms, Web Development"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="bio">Bio</label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows="4"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                </>
              )}
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
