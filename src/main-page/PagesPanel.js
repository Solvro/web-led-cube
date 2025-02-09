import React, { useState } from "react";
import "./../MainPage.css";
import "./subpages.css";
import CodeEditor from "./CodeEditor";
import Projects from "./ProjectsManager/Projects";
import { Outlet, Route, Routes, useLocation, useNavigate } from "react-router-dom";
//tymczasowe podejście
//this is a panel that displays tabs that switch to different pages like
// tutorial, upload etc.
const PagesPanel = ({
  isVisible
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true; // Home case
    return location.pathname.startsWith(`/${path}`); // Match other paths correctly
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
      path: "projects",
    },
    {
      number: 3,
      text: "Info",
      path: "info",
    },
    {
      number: 4,
      text: "Settings",
      path: "settings",
    },
  ];

  return (
    <div
      className={`code-editor-container ${isVisible ? "" : "sub-page-hidden"}`}
    >
      {/* Tabs */}
      <div className="sub-tabs-container">
        {pages.map(({ number, text, path }) => (
          <div key={number} className="sub-tab-container">
            <div
              className={`sub-tab-wall ${
                isActive(path) ? "sub-active" : ""
              }`}
            >
              <div className="colored-left"></div>
            </div>
            <button
              onClick={() => navigate(path)}
              className={`sub-tab-button ${
                isActive(path) ? "sub-active" : ""
              }`}
            >
              {text}
            </button>
            <div
              className={`sub-tab-wall ${
                isActive(path) ? "sub-active" : ""
              }`}
            >
              <div className="colored-right"></div>
            </div>
          </div>
        ))}
      </div>
      {/* Page Content */}
      <div className={`sub-page-content-container`}>
        <Outlet/>
      </div>
    </div>
  );
};

export default PagesPanel;
