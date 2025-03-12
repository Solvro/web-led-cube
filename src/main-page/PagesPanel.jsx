import React from "react";
import "./../MainPage.css";
import "./subpages.css";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { RequireAuth } from "../components/RequireAuth";
const PagesPanel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => {
    if (
      path === "/" &&
      (location.pathname === "/" || location.pathname === "/upload")
    )
      return true;
    return location.pathname === path;
  };

  const logoutUser = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const pages = [
    {
      number: 1,
      text: "Code",
      path: "/",
    },
    {
      number: 2,
      text: "Projects",
      path: "/projects",
    },
    {
      number: 3,
      text: "Tutorial",
      path: "/tutorial",
    },
  ];

  return (
    <div
      className={`code-editor-container `}
    >
      {/* Tabs */}
      <div className="sub-tabs-container">
        {pages.map(({ number, text, path }) => (
          <div key={number} className="sub-tab-container">
            <div
              className={`sub-tab-wall ${isActive(path) ? "sub-active" : ""}`}
            >
              <div className="colored-left"></div>
            </div>
            <button
              onClick={() => navigate(path)}
              className={`sub-tab-button ${isActive(path) ? "sub-active" : ""}`}
            >
              {text}
            </button>
            <div
              className={`sub-tab-wall ${isActive(path) ? "sub-active" : ""}`}
            >
              <div className="colored-right"></div>
            </div>
          </div>
        ))}
        <div className="sub-tab-button-container">
          {localStorage.getItem("accessToken") ? (
            <button className="sub-logout-button" onClick={logoutUser}>
              Log Out
            </button>
          ) : (
            <button
              className="sub-logout-button"
              onClick={() => navigate("/login")}
            >
              Log in
            </button>
          )}
        </div>
      </div>
      {/* Page Content */}
      <div className={`sub-page-content-container`}>
        <Outlet />
      </div>
    </div>
  );
};

export default PagesPanel;
