import axios from "../api/axios";
import useAuth from "./useAuth";

const LOGOUT_URL = "http://127.0.0.1:8000/auth/logout/";

const useLogout = () => {
    const { setAuth } = useAuth();
    

    const logout = async () => {
        setAuth({});
        try {
            const response = await axios(LOGOUT_URL, {
                withCredentials: true
            });
        } catch (err) {
            console.error(err);
        }
    }

    return logout;
}

export default useLogout