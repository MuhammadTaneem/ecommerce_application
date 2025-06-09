import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { CategoryType } from '../../types';
import categoryService from '../../services/categoryService';

interface CategoryState {
  categories: CategoryType[];
  isLoading: boolean;
  error: string | null;
  selectedCategory: CategoryType | null;
}

const initialState: CategoryState = {
  categories: [],
  isLoading: false,
  error: null,
  selectedCategory: null,
};

// Helper function to update a category in a nested structure
const updateCategoryInTree = (categories: CategoryType[], updatedCategory: CategoryType): CategoryType[] => {
  return categories.map(category => {
    if (category.id === updatedCategory.id) {
      return { ...updatedCategory, subcategories: category.subcategories };
    }
    if (category.subcategories?.length) {
      return {
        ...category,
        subcategories: updateCategoryInTree(category.subcategories, updatedCategory)
      };
    }
    return category;
  });
};

// Helper function to delete a category from a nested structure
const deleteCategoryFromTree = (categories: CategoryType[], categoryId: number): CategoryType[] => {
  return categories.filter(category => {
    if (category.id === categoryId) {
      return false;
    }
    if (category.subcategories?.length) {
      category.subcategories = deleteCategoryFromTree(category.subcategories, categoryId);
    }
    return true;
  });
};

// Helper function to add a category to the correct place in the tree
const addCategoryToTree = (categories: CategoryType[], newCategory: CategoryType): CategoryType[] => {
  if (!newCategory.parent) {
    return [...categories, newCategory];
  }

  return categories.map(category => {
    if (category.id === newCategory.parent) {
      return {
        ...category,
        subcategories: [...(category.subcategories || []), newCategory]
      };
    }
    if (category.subcategories?.length) {
      return {
        ...category,
        subcategories: addCategoryToTree(category.subcategories, newCategory)
      };
    }
    return category;
  });
};

// Async thunk for fetching categories
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { getState }) => {
    const state = getState() as { categories: CategoryState };
    // If we already have categories, don't fetch again
    if (state.categories.categories.length > 0) {
      return state.categories.categories;
    }
    const data = await categoryService.getCategories();
    return data;
  }
);

// Async thunk for creating a category
export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async (data: { label: string; description: string; parent?: number }) => {
    const response = await categoryService.createCategory(data);
    return response;
  }
);

// Async thunk for updating a category
export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, data }: { id: number; data: Partial<{ label: string; description: string; parent?: number }> }) => {
    const response = await categoryService.updateCategory(id, data);
    return response;
  }
);

// Async thunk for deleting a category
export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (id: number) => {
    await categoryService.deleteCategory(id);
    return id;
  }
);

// Async thunk for fetching a single category
export const fetchCategoryById = createAsyncThunk(
  'categories/fetchCategoryById',
  async (categoryId: number) => {
    const data = await categoryService.getCategoryById(categoryId);
    return data;
  }
);

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    clearSelectedCategory: (state) => {
      state.selectedCategory = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchCategories
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
        state.error = null;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch categories';
      })
      // Handle createCategory
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories = addCategoryToTree(state.categories, action.payload);
      })
      // Handle updateCategory
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.categories = updateCategoryInTree(state.categories, action.payload);
      })
      // Handle deleteCategory
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = deleteCategoryFromTree(state.categories, action.payload);
      })
      // Handle fetchCategoryById
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.selectedCategory = action.payload;
        state.categories = updateCategoryInTree(state.categories, action.payload);
      });
  },
});

export const { setSelectedCategory, clearSelectedCategory } = categorySlice.actions;
export default categorySlice.reducer;