import axios from "axios"

const authApiInstance = axios.create({
    baseURL: "http://localhost:5000/api/auth",
    withCredentials: true
})

export async function registerUser({ email, contact, password, fullname, isSeller }) {
    const response = await authApiInstance.post("/register", {
        email,
        contact,
        password,
        fullname,
        isSeller
    })

    return response.data
}


export async function LoginUser({ email, password }) {
    const response = await authApiInstance.post("/login", {
        email,
        password
    })

    return response.data
}