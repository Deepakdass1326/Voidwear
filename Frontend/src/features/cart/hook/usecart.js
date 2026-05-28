import { setCart, updateItemQuantity, removeItem as removeItemAction } from "../state/cart.slice";
import { addItem, getCart, updateQuantity, removeItem, createPaymentOrder,verifyOrder } from "../service/cart.api";
import { useDispatch } from "react-redux";

export const useCart = () => {
    const dispatch = useDispatch();

    async function handleAddItem({ productId, variantId }) {
        const data = await addItem({ productId, variantId });
        // Refetch aggregated cart so state is always in sync
        await handleFetchCart();
        return data;
    }

    async function handleFetchCart() {
        const data = await getCart();
        // data.cart is the full aggregated cart object: { _id, items, totalPrice, currency }
        dispatch(setCart(data.cart || { items: [], totalPrice: 0, currency: 'INR' }));
        return data;
    }

    async function handleUpdateQuantity({ productId, variantId, quantity }) {
        // Optimistic update in Redux
        dispatch(updateItemQuantity({ productId, variantId, quantity }));
        try {
            await updateQuantity({ productId, variantId, quantity });
            // Refetch to get correct aggregated totals from DB
            await handleFetchCart();
        } catch (err) {
            // Restore correct state on error
            await handleFetchCart();
            throw err;
        }
    }

    async function handleRemoveItem({ productId, variantId }) {
        // Optimistic remove
        dispatch(removeItemAction({ productId, variantId }));
        try {
            await removeItem({ productId, variantId });
            // Refetch to get correct aggregated totals from DB
            await handleFetchCart();
        } catch (err) {
            await handleFetchCart();
            throw err;
        }
    }


    async function handleCreateOrder() {
        const data = await createPaymentOrder();
        return data;
    }

    async function handleVerifyOrder({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    }){
      const data = await verifyOrder({razorpay_order_id,razorpay_payment_id,razorpay_signature});
      return data.success;
    }

    return { handleAddItem, handleFetchCart, handleUpdateQuantity, handleRemoveItem, handleCreateOrder,handleVerifyOrder };
};




// Keep old export for compatibility with ProductDetails.jsx
export const addToCart = () => {
    const { handleAddItem } = useCart();
    return { handleAddItem };
};