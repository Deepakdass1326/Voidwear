import axios from "axios";

const cartAPIInstance = axios.create({
    baseURL: '/api/cart',
    withCredentials: true
})

export const addItem = async ({ productId, variantId }) => {
    const response = await cartAPIInstance.post(`/add/${productId}/${variantId}`, {
        quantity: 1
    })
    return response.data
}

export const getCart = async () => {
    const response = await cartAPIInstance.get('/')
    return response.data
}

export const updateQuantity = async ({ productId, variantId, quantity }) => {
    const response = await cartAPIInstance.patch(`/update/${productId}/${variantId}`, {
        quantity
    })
    return response.data
}

export const removeItem = async ({ productId, variantId }) => {
    const response = await cartAPIInstance.delete(`/remove/${productId}/${variantId}`)
    return response.data
}
