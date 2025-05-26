import { UserType } from "@/features/auth_type.ts";
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from "@/utilites/api.ts";

export const fetchUserProfile = createAsyncThunk(
    'auth/fetchUserProfile',
    async (_, { rejectWithValue }) => {
        console.log('fetching user profile...');
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No token found');

            const response = await api.get('auth/profile/', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // If using Axios, the response data is directly accessible via `response.data`
            const data = response.data;
            console.log(data);
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

interface AuthState {
    token: string | null;
    user: UserType | null;
    is_authenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

const token = localStorage.getItem("token");

const initialState: AuthState = {
    token,
    user: null,
    is_authenticated: Boolean(token),
    isLoading: false,
    error: null
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login(state, action: PayloadAction<{ token: string }>) {
            state.token = action.payload.token;
            state.is_authenticated = true;
            localStorage.setItem("token", action.payload.token);
        },
        logout(state) {
            state.token = null;
            state.user = null;
            state.is_authenticated = false;
            localStorage.removeItem("token");
        },
        setUser(state, action: PayloadAction<UserType>) {
            state.user = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserProfile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
                state.is_authenticated = true;
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                state.is_authenticated = false;
            });
    }
});

export default authSlice.reducer;
export const { login, logout, setUser } = authSlice.actions;
