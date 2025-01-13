import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {UserType} from "@/features/auth_type.ts";

interface AuthState {
    token: string | null;
    user: UserType | null;
    is_authenticated: boolean;
}

const token = localStorage.getItem("token");

const initialState: AuthState = {
    token,
    user: null,
    is_authenticated: Boolean(token),
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login(state, action: PayloadAction<{ token: string}>) {
            state.token = action.payload.token;
            // state.user = action.payload.user;
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
});

export default authSlice.reducer;
export const { login, logout, setUser } = authSlice.actions;
