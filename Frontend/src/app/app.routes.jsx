import { createBrowserRouter, Navigate, useParams } from "react-router";
import Register from "../features/auth/pages/Register";
import Login from "../features/auth/pages/Login";
import CreateProduct from "../features/products/pages/CreateProduct";
import GetSellerProducts from "../features/products/pages/GetSellerProducts";
import Protected from "../features/auth/components/Protected";
import Home from "../features/products/pages/Home";
import ProductDetails from "../features/products/pages/ProductDetails";
import SellerProductDetail from "../features/products/pages/SellerProductDetail";
import NotFound from "../features/products/pages/NotFound";

// ── Redirect helpers (must be defined before the router uses them) ──
function RedirectProduct() {
    const { productId } = useParams();
    return <Navigate to={`/products/${productId}`} replace />;
}

function RedirectSellerProduct() {
    const { productId } = useParams();
    return <Navigate to={`/seller/products/${productId}`} replace />;
}

export const routes = createBrowserRouter([
    // ── Public ──────────────────────────────────────────────
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

    // ── Buyer product pages ──────────────────────────────────
    {
        path: "/products/:productId",
        element: <ProductDetails />
    },
    // Backward-compat redirect: old /product/:id → new /products/:id
    {
        path: "/product/:productId",
        element: <RedirectProduct />
    },

    // ── Seller dashboard (nested, all relative paths) ─────────
    {
        path: "/seller",
        children: [
            // /seller → /seller/products (primary seller landing page)
            {
                index: true,
                element: <Navigate to="/seller/products" replace />
            },
            {
                path: "products",
                element: (
                    <Protected role="seller">
                        <GetSellerProducts />
                    </Protected>
                )
            },
            {
                path: "products/new",
                element: (
                    <Protected role="seller">
                        <CreateProduct />
                    </Protected>
                )
            },
            {
                path: "products/:productId",
                element: (
                    <Protected role="seller">
                        <SellerProductDetail />
                    </Protected>
                )
            },
            // Backward-compat redirects for old paths
            {
                path: "sellerProducts",
                element: <Navigate to="/seller/products" replace />
            },
            {
                path: "create-products",
                element: <Navigate to="/seller/products/new" replace />
            },
            {
                path: "product/:productId",
                element: <RedirectSellerProduct />
            },
        ]
    },

    // ── 404 catch-all ────────────────────────────────────────
    {
        path: "*",
        element: <NotFound />
    }
]);