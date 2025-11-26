import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const topicService = {
  getAllTopics: () => {
    const token = localStorage.getItem('token');
    return axios.get(`${API_URL}/topics`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
  },
  
  getTopicById: (id) => {
    const token = localStorage.getItem('token');
    return axios.get(`${API_URL}/topics/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
  },
  
  getTopicsByCourse: (courseId) => {
    const token = localStorage.getItem('token');
    return axios.get(`${API_URL}/topics/course/${courseId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
  },
  
  searchTopics: (query) => axios.get(`${API_URL}/topics/search`, { params: { query } }),
  
  createTopic: (topicData, token) =>
    axios.post(`${API_URL}/topics`, topicData, {
      headers: { Authorization: `Bearer ${token}` }
    }),
  
  updateTopic: (id, topicData, token) =>
    axios.put(`${API_URL}/topics/${id}`, topicData, {
      headers: { Authorization: `Bearer ${token}` }
    }),
  
  deleteTopic: (id, token) =>
    axios.delete(`${API_URL}/topics/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
};

export default topicService;
