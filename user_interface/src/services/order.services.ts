import apiClient from '../config/api.config';
import { OrderType } from '../types';

// Get all products (public)


class OrderService {
  async getOrders(): Promise<OrderType[]> {
    try {
      const response = await apiClient.get('/order');
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
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
}

const orderService = new OrderService();
export default orderService;