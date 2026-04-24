import axios from "axios";

const productApiInstance = axios.create({
    baseURL: "http://localhost:5000/api/products",
    withCredentials: true
})


export async function createProduct(productData) {
    const response = await productApiInstance.post("/", productData)
    return response.data
}

export async function getAllProduct() {
    const response = await productApiInstance.get("/seller")
    return response.data
}

export async function getProducts(){
    const response = await productApiInstance.get("/")
    return response.data
}

export async function getProductDetails(id){
    const response = await productApiInstance.get(`/detail/${id}`)
    return response.data
}