import { axiosPrivate } from "../api/axios";
import { useEffect } from "react";
import { useRefresh } from "./useRefresh";
import { useAuth } from "./useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';

const useAxiosPrivate = () => {
  const refresh = useRefresh();
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        const accessToken = localStorage.getItem("accessToken") || auth?.accessToken;
        console.log("useAxios is working...")
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;

        if ((error?.response?.status === 401 || error?.response?.status === 403) && !prevRequest?.sent) {
          prevRequest.sent = true; // Prevent infinite loop

          try {
            console.log("Attempting to refresh access token...");
            const newAccessToken = await refresh();

            if (!newAccessToken) {
              setAuth({});
              throw new Error("Failed to refresh token");   
            }

            // Save new access token
            prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
            return axiosPrivate(prevRequest);
          } catch (err) {
            console.error("Token refresh failed:", err);
            setAuth({});
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
            navigate(0);
            toast.error("Session expired, please log in again.");
            return Promise.reject(error);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [auth, refresh, location, navigate, setAuth]);

  return axiosPrivate;
};

export default useAxiosPrivate;
