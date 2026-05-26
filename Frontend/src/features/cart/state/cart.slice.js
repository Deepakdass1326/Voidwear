import { createSlice } from "@reduxjs/toolkit";

// Uniqueness helper: same product + same variant (null matches null)
const sameItem = (i, productId, variantId) => {
    const sameProduct = i.product?._id?.toString() === productId;
    const sameVariant = variantId
        ? i.variant?.toString() === variantId
        : !i.variant; // both null/undefined
    return sameProduct && sameVariant;
};

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: []
    },
    reducers: {
        setItems: (state, action) => {
            state.items = action.payload;
        },
        addItem: (state, action) => {
            state.items.push(action.payload);
        },
        updateItemQuantity: (state, action) => {
            const { productId, variantId, quantity } = action.payload;
            const item = state.items.find(i => sameItem(i, productId, variantId));
            if (item) item.quantity = quantity;
        },
        removeItem: (state, action) => {
            const { productId, variantId } = action.payload;
            state.items = state.items.filter(i => !sameItem(i, productId, variantId));
        }
    }
});

export const { setItems, addItem, updateItemQuantity, removeItem } = cartSlice.actions;
export default cartSlice.reducer;