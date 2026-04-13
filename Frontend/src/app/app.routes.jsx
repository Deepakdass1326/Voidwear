import { createBrowserRouter } from "react-router";
import Register from "../features/auth/pages/register";
import Login from "../features/auth/pages/Login";

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
    }
])