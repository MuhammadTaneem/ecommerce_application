import { TagType } from '../types';
import apiClient from '../config/api.config';

const tagService = {
  // Get all tags
  async getAllTags(): Promise<TagType[]> {
    try {
      const response = await apiClient.get('/tags/');
      return response.data;
    } catch (error) {
      console.error('Error fetching tags:', error);
      throw error;
    }
  },

  // Get a single tag by ID
  async getTagById(id: number): Promise<TagType> {
    try {
      const response = await apiClient.get(`/tags/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tag:', error);
      throw error;
    }
  },

  // Create a new tag
  async createTag(data: Record<string, any>): Promise<TagType> {
    try {
      const response = await apiClient.post('/tags/', data);
      return response.data;
    } catch (error) {
      console.error('Error creating tag:', error);
      throw error;
    }
  },

  // Update a tag
  async updateTag(id: number, data: Record<string, any>): Promise<TagType> {
    try {
      const response = await apiClient.put(`/tags/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating tag:', error);
      throw error;
    }
  },

  // Delete a tag
  async deleteTag(id: number): Promise<void> {
    try {
      const response = await apiClient.delete(`/tags/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error deleting tag:', error);
      throw error;
    }
  }
};

export default tagService; 