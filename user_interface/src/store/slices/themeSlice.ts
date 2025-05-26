import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ThemeState {
  isDark: boolean;
}

const initialState: ThemeState = {
  isDark: false,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<boolean>) => {
      state.isDark = action.payload;
      localStorage.setItem('theme', action.payload ? 'dark' : 'light');
    },
    toggleTheme: (state) => {
      state.isDark = !state.isDark;
      localStorage.setItem('theme', state.isDark ? 'dark' : 'light');
    },
  },
});

export const { setTheme, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;