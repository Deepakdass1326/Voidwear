import { addItem as addItemAction, setItems, updateItemQuantity, removeItem as removeItemAction } from "../state/cart.slice";
import { addItem, getCart, updateQuantity, removeItem } from "../service/cart.api";
import { useDispatch } from "react-redux"

export const useCart = () => {
    const dispatch = useDispatch()

    async function handleAddItem({ productId, variantId }) {
        const data = await addItem({ productId, variantId })
        return data
    }

    async function handleFetchCart() {
        const data = await getCart()
        dispatch(setItems(data.cart?.items || []))
        return data
    }

    async function handleUpdateQuantity({ productId, variantId, quantity }) {
        // Optimistic update
        dispatch(updateItemQuantity({ productId, variantId, quantity }))
        try {
            const data = await updateQuantity({ productId, variantId, quantity })
            dispatch(setItems(data.cart?.items || []))
            return data
        } catch (err) {
            // Refetch on error to restore correct state
            await handleFetchCart()
            throw err
        }
    }

    async function handleRemoveItem({ productId, variantId }) {
        // Optimistic update
        dispatch(removeItemAction({ productId, variantId }))
        try {
            const data = await removeItem({ productId, variantId })
            dispatch(setItems(data.cart?.items || []))
            return data
        } catch (err) {
            await handleFetchCart()
            throw err
        }
    }

    return { handleAddItem, handleFetchCart, handleUpdateQuantity, handleRemoveItem }
}

// Keep old export for compatibility with ProductDetails.jsx
export const addToCart = () => {
    const { handleAddItem } = useCart()
    return { handleAddItem }
}