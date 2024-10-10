import {createSlice} from "@reduxjs/toolkit";
import {ProductType} from "./product_type.ts";


export interface ProductState {
    products: ProductType[];
}

const initialState: ProductState = {
    products: [],
}


export const ProductSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        addProduct: (state, action) => {
            // Add a new product to the products array
            state.products = action.payload;
        },
        removeProduct: (state, action) => {
            // Remove a product by filtering out the one with matching id
            state.products = state.products.filter(
                (product) => product.id !== action.payload
            );
        },
        updateProduct: (state, action) => {
            // Update an existing product by finding it by id
            const index = state.products.findIndex(
                (product) => product.id === action.payload.id
            );
            if (index !== -1) {
                state.products[index] = action.payload;
            }
        },

    },
});

export default ProductSlice.reducer;
export const {addProduct, removeProduct, updateProduct} = ProductSlice.actions;
