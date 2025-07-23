import { BrandType } from '../types';
import apiClient from '../config/api.config';

const brandService = {
  // Get all brands
  async getAllBrands(): Promise<BrandType[]> {
    try {
      const response = await apiClient.get('/brands/');
      // Ensure we always return an array, even if response.data is null or undefined
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching brands:', error);
      // Return empty array instead of throwing error
      return [];
    }
  },

  // Get a single brand by ID
  async getBrandById(id: number): Promise<BrandType> {
    try {
      const response = await apiClient.get(`/brands/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching brand:', error);
      throw error;
    }
  },

  // Create a new brand
  async createBrand(data: Record<string, any>): Promise<BrandType> {
    try {
      const response = await apiClient.post('/brands/', data);
      return response.data;
    } catch (error) {
      console.error('Error creating brand:', error);
      throw error;
    }
  },

  // Update a brand
  async updateBrand(id: number, data: Record<string, any>): Promise<BrandType> {
    try {
      const response = await apiClient.put(`/brands/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating brand:', error);
      throw error;
    }
  },

  // Delete a brand
  async deleteBrand(id: number): Promise<void> {
    try {
      const response = await apiClient.delete(`/brands/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error deleting brand:', error);
      throw error;
    }
  }
};

export default brandService; 