import { useRef, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from 'react-hot-toast';
import axios from "../api/axios";
import solvroLogo from "../assets/solvro-logo.svg";

import "./Login.css"; // Ensure the CSS file is imported
import { useAuth } from "../hooks/useAuth";

const LOGIN_URL = "http://127.0.0.1:8000/auth/token/";

export const Login = () => {
  const { setAuth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  // Determine where to navigate after login, default to "/" if no previous page
  const from = location.state?.from?.pathname === "/login" 
    ? "/" 
    : location.state?.from?.pathname || "/";

  const userRef = useRef();

  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");

  useEffect(() => {
    userRef.current.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ username: user, password: pwd }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      const accessToken = response?.data?.access;
      const refreshToken = response?.data?.refresh;
      const username = response?.data?.username;
      console.log("accessToken: " + accessToken + " ,refreshToken: " + refreshToken);
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("username", username);
      setAuth((prev) => ({ ...prev, user, accessToken, refreshToken }));
      setUser("");
      setPwd("");
      console.log("navigating from login...");
      navigate(from, { replace: true });
      toast.success("Logged in Successfully");
    } catch (err) {
      if (!err?.response) {
        toast.error("No server response");
      } else if (err.response?.status === 400) {
        toast.error("Missing Username or Password");
      } else if (err.response?.status === 401) {
        toast.error("Wrong Username or Password");
      } else {
        toast.error("Login Failed");
      }
    }
  };
  
  return (
    <div className="page-container w-full h-screen flex items-center justify-center bg-cover bg-center">

      <section className="login-section flex flex-col items-center justify-center w-1/3 h-full text-white">
        <img src={solvroLogo} alt="Solvro Logo" className="solvroImg w-7/10" />
        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center px-12 py-5">
          <div className="label-input-section flex flex-col mb-10 w-full relative">
            <label htmlFor="username" className="mb-1 h-8 flex items-center">USERNAME</label>
            <input
              type="text"
              className="w-full h-14 rounded-md text-lg p-2 text-black bg-[#808796] border-3 border-transparent focus:outline-none focus:border-black"
              id="username"
              ref={userRef}
              autoComplete="username"
              onChange={(e) => setUser(e.target.value)}
              value={user}
              required
              placeholder="Enter your login"
            />
          </div>
          <div className="label-input-section flex flex-col w-full relative">
            <label htmlFor="password" className="mb-1 h-8 flex items-center">PASSWORD</label>
            <input
              type="password"
              id="password"
              className="w-full h-14 rounded-md text-lg p-2 text-black bg-[#808796] border-3 border-transparent focus:outline-none focus:border-black"
              autoComplete="password"
              onChange={(e) => setPwd(e.target.value)}
              value={pwd}
              required
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="sign-in-button w-4/5 h-14 rounded-md text-xl bg-[#152959] hover:bg-[#061527] text-white transition-all duration-300 ease-in-out">Sign In</button>
        </form>
        <div className="info-container w-full flex flex-row justify-evenly mt-8">
          <p className="info-text w-1/2 flex flex-col text-center px-4 text-sm">
            <Link to="/register" aria-label="Need an account? Sign up!" className="no-underline">
              <div className="info-button rounded-md h-11 w-full flex justify-center items-center bg-black bg-opacity-70 text-white transition-all duration-300 ease-in-out hover:bg-opacity-50">Need an account?</div>
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
};