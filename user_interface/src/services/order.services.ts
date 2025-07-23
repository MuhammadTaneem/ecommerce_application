import apiClient from '../config/api.config';
import { OrderType } from '../types';

// Get all products (public)


class OrderService {
  async getOrders(): Promise<OrderType[]> {
    try {
      const response = await apiClient.get('/order');
      // Ensure we always return an array, even if response.data is null or undefined
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching orders:', error);
      // Return empty array instead of throwing error
      return [];
    }
  }

  async getOrderDetails(orderId: number | string): Promise<OrderType> {
    try {
      const response = await apiClient.get(`/order/${orderId}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching order details for order ${orderId}:`, error);
      throw error;
    }
  }

  async makeOrder(orderData: any): Promise<OrderType> {
    try {
      const response = await apiClient.post('/order/', orderData);
      return response.data;
    } catch (error) {
      console.error('Error making order:', error);
      throw error;
    }
  }

  async createOrder(orderData: any): Promise<OrderType> {
    try {
      const response = await apiClient.post('/order/', orderData);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  async updateOrderStatus(order_id: number, newStatus: number): Promise<OrderType> {
    try {
      const response = await apiClient.put(`/order/${order_id}/`, { status: newStatus });
      return response.data;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  // Add item to cart
  async addCartItem(itemData: any): Promise<any> {
    try {
      const response = await apiClient.post('/cart/item/', itemData);
      return response.data;
    } catch (error) {
      console.error('Error adding item to cart:', error);
      throw error;
    }
  }

  // Delete cart item by item id
  async deleteCartItem(itemId: number): Promise<any> {
    try {
      const response = await apiClient.delete(`/cart/item_details/${itemId}/`);
      return response.data;
    } catch (error) {
      console.error('Error deleting cart item:', error);
      throw error;
    }
  }

  async updateCartItem(itemId: number, itemData: any): Promise<any> {
    try {
      const response = await apiClient.put(`/cart/item_details/${itemId}/`, itemData);
      return response.data;
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  }

  // Get current cart
  async getCart(): Promise<any> {
    try {
      const response = await apiClient.get('/cart/get_cart/');
      return response.data;
    } catch (error) {
      console.error('Error fetching cart:', error);
      throw error;
    }
  }

  async cancelOrder(orderId: number | string): Promise<OrderType> {
    try {
      const response = await apiClient.post(`/order/${orderId}/cancel/`);
      return response.data;
    } catch (error) {
      console.error(`Error cancelling order ${orderId}:`, error);
      throw error;
    }
  }
}

const orderService = new OrderService();
export default orderService;