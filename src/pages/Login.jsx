import { useRef, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "../api/axios";

import "./Login.css";
import { useAuth } from "../hooks/useAuth";

const LOGIN_URL = "http://127.0.0.1:8000/auth/token/";

export const Login = () => {
  const { setAuth, persist, setPersist } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const from =
    location.state?.from?.pathname === "/login"
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
    await toast.promise(
      (async () => {
        try {
          const response = await axios.post(
            LOGIN_URL,
            JSON.stringify({ username: user, password: pwd }),
            {
              headers: { "Content-Type": "application/json" },
              withCredentials: true,
            }
          );
  
          const accessToken = response?.data?.access;
          const username = response?.data?.username;
  
          setAuth({ username, accessToken });
          setUser("");
          setPwd("");
          console.log("navigating from login...");
          navigate(from);
        } catch (err) {
          if (!err?.response) {
            throw new Error("No server response. Please try again.");
          } else if (err.response?.status === 400) {
            throw new Error("Missing Username or Password.");
          } else if (err.response?.status === 401) {
            throw new Error("Wrong Username or Password.");
          } else {
            throw new Error("Unexpected error. Please try again.");
          }
        }
      })(),
      {
        loading: "Logging in...",
        success: "Logged in Successfully",
        error: (err) => err.message,
      }
    );
  };

  const togglePersist = () => {
    setPersist((prev) => !prev);
  };

  return (
    <div className="page-container bg-[#061527]">
      <section className="login-section">
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
              ref={userRef}
              autoComplete="password"
              onChange={(e) => setPwd(e.target.value)}
              value={pwd}
              required
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="sign-in-button">
            Sign In
          </button>
          <div className="persistCheck">
            <input
              type="checkbox"
              id="persist"
              onChange={togglePersist}
              checked={persist}
            />
            <label htmlFor="persist">Trust This Device</label>
          </div>
        </form>
        <div className="info-container">
          <div className="info-text">
            <Link
              to="/register"
              aria-label="Need an account? Sign up!"
              className="no-underline"
            >
              <div className="info-button">Need an account?</div>
            </Link>
          </div>
          <div className="info-text">
            <Link
              to="/register"
              aria-label="Forgot your password?"
              className="no-underline"
            >
              <div className="info-button">Forgot password?</div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
