import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItemType } from '../../types';

interface CartState {
  items: CartItemType[];
  isOpen: boolean;
}

const initialState: CartState = {
  items: [],
  isOpen: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<any>) => {
      // Handle different response formats from the API
      if (action.payload && action.payload.items) {
        state.items = action.payload.items;
      } else if (Array.isArray(action.payload)) {
        state.items = action.payload;
      } else if (action.payload) {
        // If it's a single cart object with items property
        state.items = action.payload.items || [];
      } else {
        state.items = [];
      }
    },
    addToCart: (state, action: PayloadAction<CartItemType>) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ itemId: number; quantity: number }>
    ) => {
      const item = state.items.find(
        (item) => item.id === action.payload.itemId
      );
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    closeCart: (state) => {
      state.isOpen = false;
    },
    openCart: (state) => {
      state.isOpen = true;
    },
  },
});

export const {
  setCart,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleCart,
  closeCart,
  openCart,
} = cartSlice.actions;
export default cartSlice.reducer;