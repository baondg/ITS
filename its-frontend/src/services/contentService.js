import httpClient from './httpClient';

/**
 * Content Service following Single Responsibility Principle
 * Handles content-related API calls
 */
const contentService = {
  getAllContent: () => {
    return httpClient.get('/content');
  },

  getContentById: (id) => {
    return httpClient.get(`/content/${id}`);
  },

  getContentByTopic: (topicId) => {
    return httpClient.get(`/content/topic/${topicId}`);
  },

  searchContent: (query) => {
    return httpClient.get(`/content/search?query=${encodeURIComponent(query)}`);
  },

  createContent: (contentData) => {
    return httpClient.post('/content', contentData);
  },

  updateContent: (id, contentData) => {
    return httpClient.put(`/content/${id}`, contentData);
  },

  deleteContent: (id) => {
    return httpClient.delete(`/content/${id}`);
  },

  uploadFile: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return httpClient.post('/content/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  getCategories: () => {
    return httpClient.get('/content/categories');
  }
};

export default contentService;