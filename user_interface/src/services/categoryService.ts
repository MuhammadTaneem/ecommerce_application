import apiClient from '../config/api.config';
import { CategoryType } from '../types';

interface CreateCategoryData {
  label: string;
  description: string;
  parent?: number;
}

class CategoryService {
    getCategories = async (): Promise<CategoryType[]> => {
        try {
            console.log('fetching categories');
            const response = await apiClient.get('/categories');
            return response.data;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    }

    getCategoryById = async (id: number): Promise<CategoryType> => {
        try {
            const response = await apiClient.get(`/categories/${id}/`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching category ${id}:`, error);
            throw error;
        }
    }

    updateCategory = async (id: number, data: Partial<CreateCategoryData>): Promise<CategoryType> => {
        try {
            const response = await apiClient.put(`/categories/${id}/`, data);
            return response.data;
        } catch (error) {
            console.error(`Error updating category ${id}:`, error);
            throw error;
        }
    }

    createCategory = async (data: CreateCategoryData): Promise<CategoryType> => {
        try {
            const response = await apiClient.post('/categories/', data);
            return response.data;
        } catch (error) {
            console.error('Error creating category:', error);
            throw error;
        }
    }

    deleteCategory = async (id: number): Promise<void> => {
        try {
            await apiClient.delete(`/categories/${id}/`);
        } catch (error) {
            console.error(`Error deleting category ${id}:`, error);
            throw error;
        }
    }
}

const categoryService = new CategoryService();
export default categoryService; 