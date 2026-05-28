import { createSlice } from "@reduxjs/toolkit";

// Uniqueness helper: same product + same variant (null matches null)
// After aggregation: productId lives at item.products._id, variantId at item.variant
const sameItem = (i, productId, variantId) => {
    const sameProduct = i.products?._id?.toString() === productId;
    const sameVariant = variantId
        ? i.variant?.toString() === variantId
        : !i.variant; // both null/undefined
    return sameProduct && sameVariant;
};

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        totalPrice: 0,
        currency: 'INR',
        items: []
    },

    reducers: {
        // Accepts the full aggregated cart object: { _id, items, totalPrice, currency }
        setCart: (state, action) => {
            const cart = action.payload || {};
            state.items = cart.items || [];
            state.totalPrice = cart.totalPrice || 0;
            state.currency = cart.currency || 'INR';
        },
        addItem: (state, action) => {
            state.items.push(action.payload);
        },
        updateItemQuantity: (state, action) => {
            const { productId, variantId, quantity } = action.payload;
            const item = state.items.find(i => sameItem(i, productId, variantId));
            if (item) {
                item.quantity = quantity;
                // Recalculate itemPrice optimistically
                const unitPrice = item.products?.variants?.price?.amount || 0;
                item.itemPrice = unitPrice * quantity;
            }
        },
        removeItem: (state, action) => {
            const { productId, variantId } = action.payload;
            state.items = state.items.filter(i => !sameItem(i, productId, variantId));
        }
    }
});

export const { setCart, addItem, updateItemQuantity, removeItem } = cartSlice.actions;
export default cartSlice.reducer;