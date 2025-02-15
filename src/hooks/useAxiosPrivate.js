import { axiosPrivate } from "../api/axios";
import { useEffect } from "react";
import { useRefresh } from "./useRefresh";
import { useAuth } from "./useAuth";
import { useLocation, useNavigate } from "react-router-dom";

const useAxiosPrivate = () => {
  const refresh = useRefresh();
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${auth?.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;

        // 403 error = try refresh
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;
          try {
            const newAccessToken = await refresh();
            if (!newAccessToken) {
              throw new Error("Failed to refresh token"); // Force logout
            }
            prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
            return axiosPrivate(prevRequest);
          } catch (err) {
            console.error("Refresh failed:", err);
            setAuth({});
            localStorage.removeItem("auth"); // Ensure auth is cleared
            navigate("/login", { state: { from: location }, replace: true });
            return Promise.reject(error);
          }
        }

        // 401 = invalid = force logout
        if (error?.response?.status === 401) {
          console.error("Unauthorized - forcing logout");
          setAuth({});
          localStorage.removeItem("auth");
          navigate("/login", { state: { from: location }, replace: true });
          return Promise.reject(error);
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
