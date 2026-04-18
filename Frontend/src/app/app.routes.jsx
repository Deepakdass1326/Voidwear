import { createBrowserRouter } from "react-router";
import Register from "../features/auth/pages/register";
import Login from "../features/auth/pages/Login";
import CreateProduct from "../features/products/pages/CreateProduct";
import GetSellerProducts from "../features/products/pages/GetSellerProducts";

export const routes = createBrowserRouter([
    {
        path: "/",
        element: <h1>Hello</h1>
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/seller/create/products",
        element: <CreateProduct />
    },
    {
        path: "/seller/products",
        element: <GetSellerProducts />
    }
])