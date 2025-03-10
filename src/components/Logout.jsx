import React from "react";
import { useNavigate } from "react-router-dom";
import "./../main-page/subpages.css";

export const Logout = () => {
  const navigate = useNavigate();

  const logoutUser = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("username");
    navigate("/login");
  };
  return <button className="sub-tab-button" onClick={logoutUser}>Log Out</button>;
};
