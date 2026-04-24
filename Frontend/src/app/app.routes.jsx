import { createBrowserRouter } from "react-router";
import Register from "../features/auth/pages/register";
import Login from "../features/auth/pages/Login";
import CreateProduct from "../features/products/pages/CreateProduct";
import GetSellerProducts from "../features/products/pages/GetSellerProducts";
import Protected from "../features/auth/components/Protected";
import Home from "../features/products/pages/Home";
import ProductDetails from "../features/products/pages/ProductDetails";
import SellerProductDetail from "../features/products/pages/SellerProductDetail";



export const routes = createBrowserRouter([
    {
        path: "/",
        element: <Home />
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
        path: "/product/:productId",
        element: <ProductDetails />
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
            },
            {
                path: "/seller/product/:productId",
                element: <Protected
                    role="seller"
                >
                    <SellerProductDetail />
                </Protected>
            }
        ]
    }
])