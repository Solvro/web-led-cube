import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [auth, setAuth] = useState({
    accessToken: null,
    refreshToken: null,
    user: null,
  });

  useEffect(() => {
    const storedAccessToken = localStorage.getItem("accessToken");
    const storedRefreshToken = localStorage.getItem("refreshToken");

    if (storedAccessToken && storedRefreshToken) {
      setAuth({
        accessToken: storedAccessToken,
        refreshToken: storedRefreshToken,
      });
    }
  }, []);

  return { auth, setAuth };
};