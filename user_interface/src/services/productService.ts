import apiClient from '../config/api.config';
import { ProductType } from '../types';

// Get all products (public)


class ProductService {
  getProducts = async (): Promise<ProductType[]> => {
    try {
      const response = await apiClient.get('/products');
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  };

  getProductById = async (id: string|number): Promise<ProductType> => {
    try {
      const response = await apiClient.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product with id ${id}:`, error);
      throw error;
    }
  };

  getAdminProducts = async (): Promise<ProductType[]> => {
    try {
      const response = await apiClient.get('/products');
      return response.data;
    } catch (error) {
      console.error('Error fetching admin products:', error);
      throw error;
    }
  };

  getAdminProductById = async (id: number): Promise<ProductType> => {
    try {
      const response = await apiClient.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching admin product with id ${id}:`, error);
      throw error;
    }
  };

  createProduct = async (productData: Omit<ProductType, 'id'>): Promise<ProductType> => {
    try {
      const response = await apiClient.post('/products', productData);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  };

  updateProduct = async (id: number, productData: Partial<ProductType>): Promise<ProductType> => {
    try {
      const response = await apiClient.put(`/products/${id}`, productData);
      return response.data;
    }
    catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };

  deleteProduct = async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/products/${id}`);
    } catch (error) {
      console.error(`Error deleting product with id ${id}:`, error);
      throw error;
    }
  };

  // getProductReviews = async (productId: number): Promise<ReviewType[]> => {
  //   try {
  //     const response = await apiClient.get(`/products/${productId}/reviews`);
  //     return response.data;
  //   }
  //   catch (error) {
  //     console.error('Error getting product reviews:', error);
  //     throw error;
  //   }
  // };

  // getProductReviews = async (productId: number): Promise<ReviewType[]> => {
  //   try {
  //     const response = await apiClient.get(`/products/${productId}/reviews`);
  //     return response.data;
  //   }
  // };

  // createProductReview = async (productId: number, reviewData: ReviewType): Promise<ReviewType> => {
  //   try {
  //     const response = await apiClient.post(`/products/${productId}/reviews`, reviewData);
  //     return response.data;
  //   }
  // };

  // updateProductReview = async (productId: number, reviewId: number, reviewData: ReviewType): Promise<ReviewType> => {
  //   try {
  //     const response = await apiClient.put(`/products/${productId}/reviews/${reviewId}`, reviewData);
  //     return response.data;
  //   }
  // };

  // deleteProductReview = async (productId: number, reviewId: number): Promise<void> => {
  //   try {
  //     await apiClient.delete(`/products/${productId}/reviews/${reviewId}`);
  //   }
  // };

  // getProductVariants = async (productId: number): Promise<VariantType[]> => {
  //   try {
  //     const response = await apiClient.get(`/products/${productId}/variants`);
  //     return response.data;
  //   }
  // };

  // createProductVariant = async (productId: number, variantData: VariantType): Promise<VariantType> => {
  //   try {
  //     const response = await apiClient.post(`/products/${productId}/variants`, variantData);
  //     return response.data;
  //   }
  // };

  // updateProductVariant = async (productId: number, variantId: number, variantData: VariantType): Promise<VariantType> => {
  //   try {
  //     const response = await apiClient.put(`/products/${productId}/variants/${variantId}`, variantData);
  //     return response.data;
  //   }
  // };

  // deleteProductVariant = async (productId: number, variantId: number): Promise<void> => {
  //   try {
  //     await apiClient.delete(`/products/${productId}/variants/${variantId}`);
  //   }
  // };

}

const productService = new ProductService();
export default productService;
