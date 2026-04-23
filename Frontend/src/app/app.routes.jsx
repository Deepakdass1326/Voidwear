import { createBrowserRouter } from "react-router";
import Register from "../features/auth/pages/register";
import Login from "../features/auth/pages/Login";
import CreateProduct from "../features/products/pages/CreateProduct";
import GetSellerProducts from "../features/products/pages/GetSellerProducts";
import Protected from "../features/auth/components/Protected";

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
        path: "/seller",
        children: [
            {
                path: "create-products",

                element: <Protected
                    role="seller"
                > <CreateProduct /> </Protected>
            },
            {
                path: "sellerProducts",
                element: <Protected
                    role="seller"
                >
                    <GetSellerProducts />
                </Protected>
            }
        ]
    }
])