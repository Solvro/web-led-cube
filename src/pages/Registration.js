import { useRef, useState, useEffect } from "react";
import toast from 'react-hot-toast';
import axios from "../api/axios";
import { Link } from "react-router-dom";

import { IoCheckmarkOutline } from "react-icons/io5";
import { IoCloseOutline } from "react-icons/io5";

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
// const EMAIL_REGEX = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const REGISTER_URL = "/register";

const Registration = () => {

  const userRef = useRef();

  const [user, setUser] = useState("");
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    const result = USER_REGEX.test(user);
    console.log("User " + user + " + " + result);
    setValidName(result);
  }, [user]);

  useEffect(() => {
    const result = PWD_REGEX.test(pwd);
    console.log("Pwd: " + pwd + " + " + result);
    setValidPwd(result);
    const match = pwd === matchPwd;
    console.log("Match: " + match);
    setValidMatch(match);
  }, [pwd, matchPwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const v1 = USER_REGEX.test(user);
    const v2 = PWD_REGEX.test(pwd);
    if (!v1 || !v2) {
      toast.error("Invalid entry, try again");
      return;
    }
    try {
      const response = await axios.post(
        REGISTER_URL,
        JSON.stringify({ Username: user, Password: pwd }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      toast.success(JSON.stringify(response.data));
      setUser("");
      setPwd("");
    } catch (err) {
      if (!err?.respose) {
        toast.error("No Server Response");
      } else if (err.response?.status === 409) {
        toast.error("Username Taken");
      } else {
        toast.error("Registration Failed");
      }
    }
  };

  return (
    <div className="page-container">
      <section className="registration-section">
        <h1>REGISTER</h1>
        <form onSubmit={handleSubmit}>
          <div className="label-input-section">
            <label htmlFor="userName">
              USERNAME
              <span className={validName ? "valid" : "hide"}>
                <IoCheckmarkOutline />
              </span>
              <span className={validName || !user ? "hide" : "invalid"}>
                <IoCloseOutline />
              </span>
            </label>
            <input
              type="text"
              id="username"
              ref={userRef}
              autoComplete="username"
              onChange={(e) => setUser(e.target.value)}
              required
              value={user}
              aria-invalid={validName ? "false" : "true"}
              aria-describedby="uidnote"
              onFocus={() => setUserFocus(true)}
              onBlur={() => setUserFocus(false)}
              placeholder="Enter your username"
            />

            <p
              id="uidnote"
              className={` tooltip
            ${userFocus && user && !validName ? "" : "offscreen"}
          `}
            >
              4 to 24 characters. <br />
              Must begin with a letter. <br />
              Letters, numbers, underscores, hyphens allowed.
            </p>
          </div>
          <div className="label-input-section">
            <label htmlFor="password">
              PASSWORD
              <span className={validPwd ? "valid" : "hide"}>
                <IoCheckmarkOutline />
              </span>
              <span className={validPwd || !pwd ? "hide" : "invalid"}>
                <IoCloseOutline />
              </span>
            </label>
            <input
              type="password"
              id="password"
              autoComplete="new-password"
              onChange={(e) => setPwd(e.target.value)}
              required
              value={pwd}
              aria-invalid={validPwd ? "false" : "true"}
              aria-describedby="pwdnote"
              onFocus={() => setPwdFocus(true)}
              onBlur={() => setPwdFocus(false)}
              placeholder="Enter your password"
            />
            <p
              id="pwdnote"
              className={`tooltip ${
                pwdFocus && !validPwd ? "instructions" : "offscreen"
              }`}
            >
              8 to 24 characters. <br />
              Must include uppercase and lowercase letters, a number and a
              special character.
              <br />
              Allowed special characters:{" "}
              <span aria-label="exclamation mark">!</span>
              <span aria-label="at symbol">@</span>
              <span aria-label="hashtag">#</span>
              <span aria-label="dollar sign">$</span>
              <span aria-label="percent">%</span>
            </p>
          </div>
          <div className="label-input-section">
            <label htmlFor="confirm_pwd">
              CONFIRM PASSWORD
              <span className={validMatch && matchPwd ? "valid" : "hide"}>
                <IoCheckmarkOutline />
              </span>
              <span className={validMatch || !matchPwd ? "hide" : "invalid"}>
                <IoCloseOutline />
              </span>
            </label>
            <input
              type="password"
              id="confirm_pwd"
              autoComplete="new-password"
              onChange={(e) => setMatchPwd(e.target.value)}
              required
              aria-invalid={validMatch ? "false" : "true"}
              aria-describedby="confirmnote"
              onFocus={() => setMatchFocus(true)}
              onBlur={() => setMatchFocus(false)}
              placeholder="Enter your password again"
            />
            <p
              id="confirmnote"
              className={`tooltip ${
                matchFocus && !validMatch ? "instructions" : "offscreen"
              }`}
            >
              Must match the first password input field.
            </p>
          </div>

          <button
            disabled={!validName || !validPwd || !validMatch ? true : false}
            className="sign-in-button"
          >
            Sign Up
          </button>
        </form>
        <div className="info-container">
          <p className="info-text">
            <Link to="/login" aria-label="Already registered? Sign in!" className="no-underline">
              <div className="info-button">Already registered?</div>
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
};

export default Registration;
