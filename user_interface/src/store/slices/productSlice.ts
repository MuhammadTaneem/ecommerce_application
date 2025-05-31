import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../types';
import sampleProducts from '../../data/sampleProducts';

interface ProductState {
  products: Product[];
  filteredProducts: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
  searchQuery: string;
}

const initialState: ProductState = {
  products: sampleProducts,
  filteredProducts: sampleProducts,
  selectedProduct: null,
  loading: false,
  error: null,
  searchQuery: '',
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
      state.filteredProducts = filterProducts(
        action.payload,
        state.searchQuery
      );
    },
    setSelectedProduct: (state, action: PayloadAction<Product | null>) => {
      state.selectedProduct = action.payload;
    },
    setProductLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setProductError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.filteredProducts = filterProducts(
        state.products,
        action.payload
      );
    },
    filterProductsByCategory: (state, action: PayloadAction<string>) => {
      if (action.payload === 'all') {
        state.filteredProducts = filterProducts(
          state.products,
          state.searchQuery
        );
      } else {
        state.filteredProducts = state.products.filter(
          (product) => String(product.category) === action.payload
        );
      }
    },
  },
});

// Helper function to filter products by search query
function filterProducts(products: Product[], query: string): Product[] {
  if (!query) return products;
  
  const lowerQuery = query.toLowerCase();
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(lowerQuery) ||
      (product.short_description && product.short_description.toLowerCase().includes(lowerQuery))
  );
}

export const {
  setProducts,
  setSelectedProduct,
  setProductLoading,
  setProductError,
  setSearchQuery,
  filterProductsByCategory,
} = productSlice.actions;
export default productSlice.reducer;