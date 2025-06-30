import apiClient from '../config/api.config';
import { ProductType } from '../types';




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

  createProduct = async (productData: any) => {
    try {
      const response = await apiClient.post('/products/', productData);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  };

  updateProduct = async (id: number, productData: Partial<any>): Promise<ProductType> => {
    try {
      const response = await apiClient.put(`/products/${id}/`, productData);
      return response.data;
    }
    catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };

  deleteProduct = async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/products/${id}/`);
    } catch (error) {
      console.error(`Error deleting product with id ${id}:`, error);
      throw error;
    }
  };

  // Methods for multi-step product creation
  
  // Step 1: Create product with basic info
  createBasicProduct = async (productData: any): Promise<any> => {
    try {
      const response = await apiClient.post('/products/', productData);
      return response.data;
    } catch (error) {
      console.error('Error creating basic product:', error);
      throw error;
    }
  };
  
  // Step 2: Add variants/SKUs to product
  addProductSkus = async (productId: number, skuData: any): Promise<any> => {
    try {
      const response = await apiClient.post(`/products/${productId}/skus/`, skuData);
      return response.data;
    } catch (error) {
      console.error('Error adding SKUs:', error);
      throw error;
    }
  };
  updateProductSkus = async (productId: number,skuId: number, skuData: any): Promise<any> => {
    try {
      const response = await apiClient.put(`/products/${productId}/skus/${skuId}/`, skuData);
      return response.data;
    } catch (error) {
      console.error('Error adding SKUs:', error);
      throw error;
    }
  };

  deleteProductSkus = async (productId: number,skuId: number): Promise<any> => {
    try {
      const response = await apiClient.delete(`/products/${productId}/skus/${skuId}/`);
      return response.data;
    } catch (error) {
      console.error('Error adding SKUs:', error);
      throw error;
    }
  };
  
  // Step 3: Add tags to product
  addProductTags = async (productId: number, tagData: { tag_ids: number[] }): Promise<any> => {
    try {
      const response = await apiClient.post(`/products/${productId}/tags/`, tagData);
      return response.data;
    } catch (error) {
      console.error('Error adding tags:', error);
      throw error;
    }
  };
  
  // Step 4: Add images to product
  addProductImages = async (productId: number, imageData: FormData): Promise<any> => {
    try {
      const response = await apiClient.post(`/products/${productId}/images/`, imageData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error adding product images:', error);
      throw error;
    }
  };

  // Delete a product image
  deleteProductImage = async (productId: number, imageId: number): Promise<any> => {
    try {
      const response = await apiClient.delete(`/products/${productId}/images/${imageId}/`);
      return response.data;
    } catch (error) {
      console.error('Error deleting product image:', error);
      throw error;
    }
  };

  // Commented out methods that may be implemented later
  /* 
  getProductReviews = async (productId: number): Promise<ReviewType[]> => {
    try {
      const response = await apiClient.get(`/products/${productId}/reviews`);
      return response.data;
    } catch (error) {
      console.error('Error getting product reviews:', error);
      throw error;
    }
  };

  createProductReview = async (productId: number, reviewData: ReviewType): Promise<ReviewType> => {
    try {
      const response = await apiClient.post(`/products/${productId}/reviews`, reviewData);
      return response.data;
    } catch (error) {
      console.error('Error creating product review:', error);
      throw error;
    }
  };
  */

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
