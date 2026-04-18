import { createProduct, getAllProduct } from "../services/products.api";
import { useDispatch } from "react-redux";
import { setSellerProducts } from "../state/product.slice";

export const useProducts = () => {

    const dispatch = useDispatch()

    async function handleCreateProduct(productData) {
        const data = await createProduct(productData)
        return data.products
    }


    async function handleGetSellerProducts() {
        const data = await getAllProduct()
        dispatch(setSellerProducts(data.products))
        return data.products
    }

    return { handleCreateProduct, handleGetSellerProducts }
}

