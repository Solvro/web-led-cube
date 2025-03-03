import axios from "../api/axios";
import { useAuth } from "./useAuth";

export const useRefresh = () => {
  const REFRESH_URL = "http://127.0.0.1:8000/auth/token/refresh/";
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await axios.post(
      REFRESH_URL,
      {},
      {
        withCredentials: true,
      }
    );
    setAuth((prev) => {
      console.log(JSON.stringify(prev));
      console.log(response?.data?.access);
      return { ...prev, accessToken: response.data.access };
    });
    return response.data.access;
  };
  return refresh;
};
