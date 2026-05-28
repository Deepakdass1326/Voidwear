import axios from "axios";

const cartAPIInstance = axios.create({
    baseURL: '/api/cart',
    withCredentials: true
});

export const addItem = async ({ productId, variantId }) => {
    // Use the string "null" as a sentinel so the route param is always present
    // The backend normalises "null" → null
    const vid = variantId || 'null';
    const response = await cartAPIInstance.post(`/add/${productId}/${vid}`, {
        quantity: 1
    });
    return response.data;
};

export const getCart = async () => {
    const response = await cartAPIInstance.get('/');
    return response.data;
};

export const updateQuantity = async ({ productId, variantId, quantity }) => {
    const vid = variantId || 'null';
    const response = await cartAPIInstance.patch(`/update/${productId}/${vid}`, {
        quantity
    });
    return response.data;
};

export const removeItem = async ({ productId, variantId }) => {
    const vid = variantId || 'null';
    const response = await cartAPIInstance.delete(`/remove/${productId}/${vid}`);
    return response.data;
};

export const createPaymentOrder = async () => {
    const response = await cartAPIInstance.post('/payment/create/order');
    return response.data;
}

export const verifyOrder = async({razorpay_order_id,razorpay_payment_id,razorpay_signature})=>{
  
    const response = await cartAPIInstance.post('/payment/verify/order',{
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
    });
    return response.data;
}