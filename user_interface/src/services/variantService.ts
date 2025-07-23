import { VariantType } from '../types';
import apiClient from '../config/api.config';

// Mock data for development




const variantService = {
  // Get all variants
  async getAllVariants(): Promise<VariantType[]> {
    try {
      // In production, use this:
      const response = await apiClient.get('/variants');
      // Ensure we always return an array, even if response.data is null or undefined
      return Array.isArray(response.data) ? response.data : [];
      
    } catch (error) {
      console.error('Error fetching variants:', error);
      // Return empty array instead of throwing error
      return [];
    }
  },

  // Get a single variant by ID
  async getVariantById(id: number): Promise<VariantType | null> {
    try {
      // In production, use this:
      const response = await apiClient.get(`/variants/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching variant:', error);
      throw error;
    }
  },

  // Create a new variant
  async createVariant(data: Record<string, any>): Promise<VariantType> {
    try {
      // In production, use this:
      const response = await apiClient.post('/variants/', data);
      return response.data;

      
      
    } catch (error) {
      console.error('Error creating variant:', error);
      throw error;
    }
  },

  // Update a variant
  async updateVariant(id: number, data: Record<string, any>): Promise<VariantType> {
    try {
      // In production, use this:
      console.log(data);
      const response = await apiClient.put(`/variants/${id}/`, data);
      return response.data;
      
    } catch (error) {
      console.error('Error updating variant:', error);
      throw error;
    }
  },

  // Delete a variant
  async deleteVariant(id: number): Promise<void> {
    try {
      const response = await apiClient.delete(`/variants/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error deleting variant:', error);
      throw error;
    }
  }
};

export default variantService; 