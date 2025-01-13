import {configureStore} from '@reduxjs/toolkit';
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {CategorySlice} from "../features/categoriesSlice.ts";
import {ProductSlice} from "../features/productSlice.ts";
import {authSlice} from "../features/authSlice.ts";


export const store = configureStore({
    reducer: {
        categories: CategorySlice.reducer,
        products: ProductSlice.reducer,
        auth: authSlice.reducer,
    }
})


export const useAppDispatch: () => typeof store.dispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<ReturnType<typeof store.getState>> = useSelector