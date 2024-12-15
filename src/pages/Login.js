import { useRef, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from 'react-hot-toast';
import axios from "../api/axios";

import "./Login.css";
import { useAuth } from "../hooks/useAuth";

const LOGIN_URL = "/auth";

const Login = () => {
  const { setAuth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

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
        JSON.stringify({ User: user, Password: pwd }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const accessToken = response?.data?.accessToken;
      const roles = response?.data?.roles;
      console.log("roles: " + roles + ", accessToken: " + accessToken);
      setAuth({ user, pwd, roles, accessToken });
      setUser("");
      setPwd("");
      navigate(from, { replace: true });
    } catch (err) {
      if (!err?.response) {
        toast.error("No server response")
      } else if (err.response?.status === 400) {
        toast.error("Missing Username or Password")
      } else if (err.response?.status === 401) {
        toast.error("Unauthorized")
      } else {
        toast.error("Login Failed")
      }
    }
  };

  return (
    <div className="page-container">
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
        <button type="submit" className="sign-in-button">Sign In</button>
      </form>
      <div className="info-container">
      <p className="info-text">
          <Link to="/register" aria-label="Need an account? Sign up!" className="no-underline"><div className="info-button" >Need an account?</div></Link>
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