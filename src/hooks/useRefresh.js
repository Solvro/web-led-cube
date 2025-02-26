import axios from "../api/axios";
import { useAuth } from "./useAuth";

export const useRefresh = () => {
  const REFRESH_URL = "http://127.0.0.1:8000/auth/token/refresh/";
  const { auth, setAuth } = useAuth();
  const refreshToken = localStorage.getItem("refreshToken") || auth?.refreshToken;
  const refresh = async () => {
    try {
      const response = await axios.post(
        REFRESH_URL,
        JSON.stringify({ refresh: refreshToken }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setAuth((prev) => {
        console.log(JSON.stringify(prev));
        console.log("returned response data from refresh")
        console.log(response?.data?.access);
        return { ...prev, accessToken: response.data.access };
      });
      return response.data.access;
    } catch (error) {
      console.error("Refresh token failed", error);
      return null;
    }
  };
  return refresh;
};
