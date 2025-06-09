// src/store/contextSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ContextDataType } from '../../types';
import homeService from '../../services/index';

interface ContextState {
  contextData: ContextDataType | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ContextState = {
  contextData: null,
  isLoading: false,
  error: null,
};

// Async thunk for fetching context data
export const fetchContextData = createAsyncThunk(
  'context/fetchContextData',
  async (_, { getState }) => {
    const state = getState() as { context: ContextState };
    // If we already have context data, don't fetch again
    if (state.context.contextData) {
      return state.context.contextData;
    }
    const data = await homeService.getContextData();
    return data;
  }
);

const contextSlice = createSlice({
  name: 'context',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContextData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchContextData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.contextData = action.payload;
        state.error = null;
      })
      .addCase(fetchContextData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch context data';
      });
  },
});

export default contextSlice.reducer;

export const selectContextData = (state: { context: ContextState }): ContextDataType | null =>
    state.context.contextData;
