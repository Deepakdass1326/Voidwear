import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: []
    },
    reducers: {
        setItems: (state, action) => {
            state.items = action.payload
        },
        addItem: (state, action) => {
            state.items.push(action.payload)
        },
        updateItemQuantity: (state, action) => {
            const { productId, variantId, quantity } = action.payload
            const item = state.items.find(
                i => i.product?._id?.toString() === productId && i.variant?.toString() === variantId
            )
            if (item) item.quantity = quantity
        },
        removeItem: (state, action) => {
            const { productId, variantId } = action.payload
            state.items = state.items.filter(
                i => !(i.product?._id?.toString() === productId && i.variant?.toString() === variantId)
            )
        }
    }
})

export const { setItems, addItem, updateItemQuantity, removeItem } = cartSlice.actions
export default cartSlice.reducer