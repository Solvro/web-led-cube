import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { useRefresh } from "../hooks/useRefresh";
import { useAuth } from "../hooks/useAuth";

export const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefresh();
  const { auth, setAuth } = useAuth();

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        const newAccessToken = await refresh();
        setAuth(prev => ({ ...prev, accessToken: newAccessToken }));
      } catch (err) {
        console.error("Error refreshing token:", err);
        localStorage.removeItem("auth"); // Clear session if refresh fails
      } finally {
        setIsLoading(false);
      }
    };

    if (!auth?.accessToken) {
      verifyRefreshToken();
    } else {
      setIsLoading(false);
    }
  }, [auth, setAuth]);

  useEffect(() => {
    console.log(`isLoading: ${isLoading}`);
    console.log(`aT: ${JSON.stringify(auth?.accessToken)}`);
  }, [isLoading]);

  return <>{isLoading ? <p>Loading...</p> : <Outlet />}</>;
};
