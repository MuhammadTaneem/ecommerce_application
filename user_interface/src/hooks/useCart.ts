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
} from '../store/slices/cartSlice';
import { CartItem, Product } from '../types';

export const useCart = () => {
  const dispatch = useDispatch();
  const { items, isOpen } = useSelector((state: RootState) => state.cart);

  const addItem = (product: Product, quantity: number = 1) => {
    const cartItem: CartItem = {
      id: Date.now(),
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.image,
    };
    
    dispatch(addToCart(cartItem));
    dispatch(openCart());
  };

  const removeItem = (productId: number) => {
    dispatch(removeFromCart(productId));
  };

  const updateItemQuantity = (productId: number, quantity: number) => {
    dispatch(updateQuantity({ productId, quantity }));
  };

  const empty = () => {
    dispatch(clearCart());
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

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  
  const totalPrice = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return {
    items,
    isOpen,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    updateItemQuantity,
    empty,
    toggle,
    open,
    close,
  };
};