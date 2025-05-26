import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Category } from '../../types';
import { categoryData } from '../../data/categories';

interface CategoryState {
  categories: Category[];
  selectedCategory: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: categoryData,
  selectedCategory: null,
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload;
    },
    setCategoryLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setCategoryError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setCategories,
  setSelectedCategory,
  setCategoryLoading,
  setCategoryError,
} = categorySlice.actions;
export default categorySlice.reducer;