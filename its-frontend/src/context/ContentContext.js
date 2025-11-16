import React, { createContext, useState, useContext } from 'react';
import contentService from '../services/contentService';

/**
 * Content Context following Context API pattern
 * Manages global content state
 */
const ContentContext = createContext();

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};

export const ContentProvider = ({ children }) => {
  const [contents, setContents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAllContent = async () => {
    try {
      setIsLoading(true);
      const response = await contentService.getAllContent();
      setContents(response.data);
    } catch (error) {
      console.error('Failed to fetch content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchContentByTopic = async (topicId) => {
    try {
      setIsLoading(true);
      const response = await contentService.getContentByTopic(topicId);
      setContents(response.data);
    } catch (error) {
      console.error('Failed to fetch content by topic:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const searchContent = async (query) => {
    try {
      setIsLoading(true);
      const response = await contentService.searchContent(query);
      setContents(response.data);
    } catch (error) {
      console.error('Failed to search content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createContent = async (contentData) => {
    try {
      const response = await contentService.createContent(contentData);
      setContents(prev => [...prev, response.data]);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to create content' 
      };
    }
  };

  const updateContent = async (id, contentData) => {
    try {
      const response = await contentService.updateContent(id, contentData);
      setContents(prev => prev.map(content => 
        content.id === id ? response.data : content
      ));
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to update content' 
      };
    }
  };

  const deleteContent = async (id) => {
    try {
      await contentService.deleteContent(id);
      setContents(prev => prev.filter(content => content.id !== id));
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to delete content' 
      };
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await contentService.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const value = {
    contents,
    categories,
    isLoading,
    fetchAllContent,
    fetchContentByTopic,
    searchContent,
    createContent,
    updateContent,
    deleteContent,
    fetchCategories
  };

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
};