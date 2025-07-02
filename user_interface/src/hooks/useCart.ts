import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleCart,
  openCart,
  closeCart,
  setCart,
} from '../store/slices/cartSlice';
import { CartItemType, ProductType } from '../types';
import orderService from '../services/order.services';
import { useEffect, useState } from 'react';
import { useToast } from './use-toast';

export const useCart = () => {
  const dispatch = useDispatch();
  const { items, isOpen } = useSelector((state: RootState) => state.cart);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Fetch cart data from API on initial load
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const cartData = await orderService.getCart();
        if (cartData) {
          dispatch(setCart(cartData));
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [dispatch]);

  // Legacy method - consider deprecating in favor of direct API calls
  const addItem = (product: ProductType, quantity: number = 1) => {
    const cartItem: Partial<CartItemType> = {
      id: Date.now(),
      product: product.id,
      quantity,
      unit_price: product.discount_price || product.base_price,
      subtotal: String(Number(product.discount_price || product.base_price) * quantity),
      // Set sku to 0 for products without variants, will be overridden for products with variants
      sku: 0
    };
    
    dispatch(addToCart(cartItem as CartItemType));
    dispatch(openCart());
  };

  const removeItem = async (itemId: number) => {
    try {
      setLoading(true);
      await orderService.deleteCartItem(itemId);
      dispatch(removeFromCart(itemId));
      
      // Refresh cart after deletion
      const cartData = await orderService.getCart();
      dispatch(setCart(cartData));
      
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart",
        variant: "default"
      });
    } catch (error) {
      console.error('Error removing item from cart:', error);
      toast({
        title: "Error",
        description: "Failed to remove item from cart",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateItemQuantity = async (itemId: number, quantity: number) => {
    try {
      setLoading(true);
      
      // Find the item to get its SKU
      const item = items.find(item => item.id === itemId);
      if (!item) {
        throw new Error('Item not found');
      }
      
      // Create the request payload
      const updateData = {
        quantity: quantity,
        sku: item.sku
      };
      
      // Call API to update item quantity
      await orderService.updateCartItem(itemId, updateData);
      
      // Update local state
      dispatch(updateQuantity({ itemId, quantity }));
      
      // Refresh cart to get updated totals
      const cartData = await orderService.getCart();
      dispatch(setCart(cartData));
    } catch (error) {
      console.error('Error updating item quantity:', error);
      toast({
        title: "Error",
        description: "Failed to update item quantity",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const empty = () => {
    // This would require a new API endpoint to clear cart
    // For now, we'll just clear the local state
    dispatch(clearCart());
  };

  const updateCart = (cartData: any) => {
    dispatch(setCart(cartData));
  };

  const toggle = () => {
    dispatch(toggleCart());
  };

  const open = () => {
    dispatch(openCart());
  };

  const close = () => {
    dispatch(closeCart());
  };

  // Calculate totals based on cart items
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  
  const totalPrice = items.reduce(
    (total, item) => total + Number(item.unit_price) * item.quantity,
    0
  );

  return {
    items,
    isOpen,
    loading,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    updateItemQuantity,
    updateCart,
    empty,
    toggle,
    open,
    close,
  };
};