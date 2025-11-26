import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const courseService = {
  getAllCourses: () => {
    const token = localStorage.getItem('token');
    return axios.get(`${API_URL}/courses`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
  },
  
  getCourseById: (id) => {
    const token = localStorage.getItem('token');
    return axios.get(`${API_URL}/courses/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
  },
  
  getPublishedCourses: () => {
    const token = localStorage.getItem('token');
    return axios.get(`${API_URL}/courses/published`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
  },
  
  getCoursesByDifficulty: (level) => axios.get(`${API_URL}/courses/difficulty/${level}`),
  
  getCoursesBySubject: (subject) => axios.get(`${API_URL}/courses/subject/${subject}`),
  
  searchCourses: (query) => axios.get(`${API_URL}/courses/search`, { params: { query } }),
  
  createCourse: (courseData, token) => 
    axios.post(`${API_URL}/courses`, courseData, {
      headers: { Authorization: `Bearer ${token}` }
    }),
  
  updateCourse: (id, courseData, token) =>
    axios.put(`${API_URL}/courses/${id}`, courseData, {
      headers: { Authorization: `Bearer ${token}` }
    }),
  
  deleteCourse: (id, token) =>
    axios.delete(`${API_URL}/courses/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }),
  
  getMyCourses: (token) =>
    axios.get(`${API_URL}/courses/my-courses`, {
      headers: { Authorization: `Bearer ${token}` }
    }),
  
  getDifficultyLevels: () => axios.get(`${API_URL}/courses/difficulty-levels`)
};

export default courseService;
