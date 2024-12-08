import { useContext } from "react";
import AuthContext from "../context/AuthProvider";

export const useAuth = () => {
    return useContext(AuthContext);
}