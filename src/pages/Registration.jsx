import { useRef, useState, useEffect } from "react";
import toast from 'react-hot-toast';
import axios from "../api/axios";
import { Link, useNavigate } from "react-router-dom";

import { IoCheckmarkOutline } from "react-icons/io5";
import { IoCloseOutline } from "react-icons/io5";

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const NAME_REGEX = /^[A-Za-z]+([ '-][A-Za-z]+)*$/;
const LNAME_REGEX = /^[A-Za-z]+([ '-][A-Za-z]+)*$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const REGISTER_URL = "http://127.0.0.1:8000/auth/register/";

export const Registration = () => {
  const navigate = useNavigate();
  const userRef = useRef();

  const [user, setUser] = useState("");
  const [validUser, setValidUser] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);

  const [name, setName] = useState("");
  const [validName, setValidName] = useState(false);
  const [nameFocus, setNameFocus] = useState(false);

  const [lname, setLname] = useState("");
  const [validLname, setValidLname] = useState(false);
  const [lnameFocus, setLnameFocus] = useState(false);

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
    setValidUser(result);
  }, [user]);
  useEffect(() => {
    const result = NAME_REGEX.test(name);
    console.log("Name " + name + " + " + result);
    setValidName(result);
  }, [name]);
  useEffect(() => {
    const result = LNAME_REGEX.test(lname);
    console.log("Lname " + lname + " + " + result);
    setValidLname(result);
  }, [lname]);
  useEffect(() => {
    const result = EMAIL_REGEX.test(email);
    console.log("Email " + email + " + " + result);
    setValidEmail(result);
  }, [email]);

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
    const v2 = EMAIL_REGEX.test(email);
    const v3 = PWD_REGEX.test(pwd);
    const v4 = NAME_REGEX.test(name)
    const v5 = LNAME_REGEX.test(lname)
    if (!v1 || !v2 || !v3 || !v4 || !v5) {
      toast.error("Invalid entry, try again");
      return;
    }
    await toast.promise(
      (async () => {
        try {
          const response = await axios.post(
            REGISTER_URL,
            JSON.stringify({ username: user, password: pwd, email: email, first_name: name, last_name: lname }),
            {
              headers: { "Content-Type": "application/json" },
            }
          );
          // toast.success(JSON.stringify(response.data));
          console.log(JSON.stringify(response.data))
          setUser("");
          setEmail("");
          setName("");
          setLname("");
          setPwd("");
          setMatchPwd("");
          navigate("/login");
        } catch (err) {
          if (!err?.response) {
            throw new Error("No server response. Please try again.");
          } else if (err.response?.status === 400) {
            // check if the error is due to email conflict
            if (err.response?.data?.email) {
              throw new Error("Email Already Taken");
            } else if (err.response?.data?.username) {
              throw new Error("Username Taken");
            } else {
              throw new Error("Registration Failed");
            }
          } else {
            throw new Error("Registration Failed");
          }
        }
      })(),
      {
        loading: "",
        success: "Registered Successfully",
        error: (err) => err.message,
      }
    );
  };

  return (
    <div className="page-container">
      <section className="registration-section">
        <h1>REGISTER</h1>
        <form onSubmit={handleSubmit}>
          <div className="label-input-section">
            <label htmlFor="userName">
              USERNAME
              <span className={validUser ? "valid" : "hide"}>
                <IoCheckmarkOutline />
              </span>
              <span className={validUser || !user ? "hide" : "invalid"}>
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
              aria-invalid={validUser ? "false" : "true"}
              aria-describedby="uidnote"
              onFocus={() => setUserFocus(true)}
              onBlur={() => setUserFocus(false)}
              placeholder="Enter your username"
            />

            <p
              id="uidnote"
              className={` tooltip
            ${userFocus && user && !validUser ? "" : "offscreen"}
            `}
            >
              4 to 24 characters. <br />
              Must begin with a letter. <br />
              Letters, numbers, underscores, hyphens allowed.
            </p>
          </div>
          <div className="label-input-section">
            <label htmlFor="email">
              EMAIL
              <span className={validEmail ? "valid" : "hide"}>
                <IoCheckmarkOutline />
              </span>
              <span className={validEmail || !email ? "hide" : "invalid"}>
                <IoCloseOutline />
              </span>
            </label>
            <input
              type="text"
              id="email"
              ref={userRef}
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
              required
              value={email}
              aria-invalid={validEmail ? "false" : "true"}
              aria-describedby="uidnote"
              placeholder="Enter your email"
            />
          </div>
          <div className="label-input-section">
            <label htmlFor="name">
              FIRST NAME
              <span className={validName ? "valid" : "hide"}>
                <IoCheckmarkOutline />
              </span>
              <span className={validName || !name ? "hide" : "invalid"}>
                <IoCloseOutline />
              </span>
            </label>
            <input
              type="text"
              id="name"
              ref={userRef}
              autoComplete="firstName"
              onChange={(e) => setName(e.target.value)}
              required
              value={name}
              aria-invalid={validName ? "false" : "true"}
              aria-describedby="uidnote"
              onFocus={() => setNameFocus(true)}
              onBlur={() => setNameFocus(false)}
              placeholder="Enter your first name"
            />
            <p
              id="uidnote"
              className={` tooltip
            ${nameFocus && name && !validName ? "" : "offscreen"}
            `}
            >
              Cannot contain numbers. <br />
              At least 1 letter long. <br />
              Hyphens allowed.
            </p>
          </div>
          <div className="label-input-section">
            <label htmlFor="lname">
              LAST NAME
              <span className={validLname ? "valid" : "hide"}>
                <IoCheckmarkOutline />
              </span>
              <span className={validLname || !lname ? "hide" : "invalid"}>
                <IoCloseOutline />
              </span>
            </label>
            <input
              type="text"
              id="lname"
              ref={userRef}
              autoComplete="firstName"
              onChange={(e) => setLname(e.target.value)}
              required
              value={lname}
              aria-invalid={validLname ? "false" : "true"}
              aria-describedby="uidnote"
              onFocus={() => setLnameFocus(true)}
              onBlur={() => setLnameFocus(false)}
              placeholder="Enter your last name"
            />
            <p
              id="uidnote"
              className={` tooltip
            ${lnameFocus && lname && !validLname ? "" : "offscreen"}
            `}
            >
              Cannot contain numbers. <br />
              At least 1 letter long. <br />
              Hyphens allowed.
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
              // I am not sure if I can give matchPwd value - if it causes problems, clear it
              value={matchPwd}
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
            disabled={!validUser || !validEmail || !validName || !validLname || !validPwd || !validMatch ? true : false}
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
