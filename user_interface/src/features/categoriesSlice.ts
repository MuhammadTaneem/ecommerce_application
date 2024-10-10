import {createSlice} from "@reduxjs/toolkit";
import {CategoryType} from "./categories_type.ts";


export interface CategoryState {
    categories: CategoryType[];
}

const initialState: CategoryState = {
    categories: [],
}

export const CategorySlice = createSlice({
    name: "categories",
    initialState,
    reducers: {
        addCategory: (state, action) => {

            state.categories = action.payload;
        },
        removeCategory: (sate, action) => {
            sate.categories = sate.categories.filter((category) => category.id !== action.payload);
        }
    },
})


export default CategorySlice.reducer;
export const {addCategory, removeCategory} = CategorySlice.actions;
