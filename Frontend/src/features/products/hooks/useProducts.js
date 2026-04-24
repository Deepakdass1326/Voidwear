import { createProduct, getAllProduct, getProducts, getProductDetails } from "../services/products.api";
import { useDispatch } from "react-redux";
import { setSellerProducts, setProducts } from "../state/product.slice";

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

    async function handleGetProducts(){
        const data = await getProducts()
        dispatch(setProducts(data.products))
        return data.products
    }
    

    async function handleGetProductDetails(id){
        const data = await getProductDetails(id)
        return data.product
    }

    return { handleCreateProduct, handleGetSellerProducts, handleGetProducts, handleGetProductDetails }
}

