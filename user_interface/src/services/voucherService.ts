import { VoucherType } from '../types';
import apiClient from '../config/api.config';

const voucherService = {
  // Get all vouchers
  async getAllVouchers(): Promise<VoucherType[]> {
    try {
      const response = await apiClient.get('/voucher/');
      // Ensure we always return an array, even if response.data is null or undefined
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching vouchers:', error);
      // Return empty array instead of throwing error
      return [];
    }
  },

  // Get a single voucher by ID
  async getVoucherById(id: number): Promise<VoucherType> {
    try {
      const response = await apiClient.get(`/voucher/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching voucher:', error);
      throw error;
    }
  },

  // Create a new voucher
  async createVoucher(data: Record<string, any>): Promise<VoucherType> {
    try {
      const response = await apiClient.post('/voucher/', data);
      return response.data;
    } catch (error) {
      console.error('Error creating voucher:', error);
      throw error;
    }
  },

  // Update a voucher
  async updateVoucher(id: number, data: Record<string, any>): Promise<VoucherType> {
    try {
      const response = await apiClient.put(`/voucher/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating voucher:', error);
      throw error;
    }
  },

  // Delete a voucher
  async deleteVoucher(id: number): Promise<void> {
    try {
      const response = await apiClient.delete(`/voucher/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error deleting voucher:', error);
      throw error;
    }
  }
};

export default voucherService; 