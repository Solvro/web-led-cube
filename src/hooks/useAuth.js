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
    const storedUsername = localStorage.getItem("username");

    if (storedAccessToken && storedRefreshToken && storedUsername) {
      setAuth({
        accessToken: storedAccessToken,
        refreshToken: storedRefreshToken,
        user: storedUsername
      });
    }
  }, []);

  return { auth, setAuth };
};