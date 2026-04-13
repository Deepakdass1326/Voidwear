import { setError, setLoading, setUser } from "../state/auth.slice";
import { LoginUser, registerUser } from "../service/auth.api";
import { useDispatch } from "react-redux";

export const useAuth = () => {

    const dispatch = useDispatch()

    async function handleRegister({
        email, contact, password, fullname, isSeller = false
    }) {
        try {
            dispatch(setLoading(true));
            const response = await registerUser({
                email, contact, password, fullname, isSeller
            })

            dispatch(setUser(response.user || response))
        } catch (error) {
            dispatch(setError(error?.response?.data?.message || "Registration failed"));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleLogin({ email, password }) {
        try {
            dispatch(setLoading(true));
            const response = await LoginUser({
                email, password
            })

            dispatch(setUser(response.user || response))
        } catch (error) {
            dispatch(setError(error?.response?.data?.message || "Login failed"));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }


    return { handleRegister, handleLogin }
}