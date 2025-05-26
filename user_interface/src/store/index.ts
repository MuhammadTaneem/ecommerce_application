import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './slices/themeSlice';
import cartReducer from './slices/cartSlice';
import authReducer from './slices/authSlice';
import categoryReducer from './slices/categorySlice';
import productReducer from './slices/productSlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    cart: cartReducer,
    auth: authReducer,
    categories: categoryReducer,
    products: productReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;