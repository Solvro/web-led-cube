import { useRef, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from 'react-hot-toast';
import axios from "../api/axios";
import solvroLogo from "../assets/solvro-logo.svg";

import "./Login.css";
import { useAuth } from "../hooks/useAuth";

const LOGIN_URL = "http://127.0.0.1:8000/auth/token/";

const Login = () => {
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
      console.log("accessToken: " + accessToken + " ,refreshToken: " + refreshToken);
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
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
    <div className="page-container w-full h-lvh flex items-center justify-center">

      <section className="login-section">
      <img src={solvroLogo} alt="Solvro Logo" className="relative" />
        <h1>LOGIN</h1>
        <form onSubmit={handleSubmit}>
          <div className="label-input-section">
            <label htmlFor="username">USERNAME</label>
            <input
              type="text"
              id="username"
              ref={userRef}
              autoComplete="username"
              onChange={(e) => setUser(e.target.value)}
              value={user}
              required
              placeholder="Enter your login"
            />
          </div>
          <div className="label-input-section">
            <label htmlFor="password">PASSWORD</label>
            <input
              type="password"
              id="password"
              autoComplete="password"
              onChange={(e) => setPwd(e.target.value)}
              value={pwd}
              required
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="sign-in-button">Sign In</button>
        </form>
        <div className="info-container">
          <p className="info-text">
            <Link to="/register" aria-label="Need an account? Sign up!" className="no-underline"><div className="info-button">Need an account?</div></Link>
          </p>
          <p className="info-text">
            <Link to="/register" aria-label="Forgot your password?" className="no-underline"><div className="info-button">Forgot password?</div></Link>
          </p>
        </div>
      </section>
    </div>
  );
};

export default Login;
