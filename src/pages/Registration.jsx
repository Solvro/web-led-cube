import { useRef, useState, useEffect } from "react";
import toast from 'react-hot-toast';
import axios from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import solvroLogo from "../assets/solvro-logo.svg";

import { IoCheckmarkOutline } from "react-icons/io5";
import { IoCloseOutline } from "react-icons/io5";

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const NAME_REGEX = /^[A-Za-z]+([ '-][A-Za-z]+)*$/;
const LNAME_REGEX = /^[A-Za-z]+([ '-][A-Za-z]+)*$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const REGISTER_URL = "http://127.0.0.1:8000/auth/register/";

const Registration = () => {
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
    setValidUser(result);
  }, [user]);
  useEffect(() => {
    const result = NAME_REGEX.test(name);
    setValidName(result);
  }, [name]);
  useEffect(() => {
    const result = LNAME_REGEX.test(lname);
    setValidLname(result);
  }, [lname]);
  useEffect(() => {
    const result = EMAIL_REGEX.test(email);
    setValidEmail(result);
  }, [email]);

  useEffect(() => {
    const result = PWD_REGEX.test(pwd);
    setValidPwd(result);
    const match = pwd === matchPwd;
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
    try {
      const response = await axios.post(
        REGISTER_URL,
        JSON.stringify({ username: user, password: pwd, email: email, first_name: name, last_name: lname }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success("Registration complete");
      setUser("");
      setEmail("");
      setName("");
      setLname("");
      setPwd("");
      setMatchPwd("");
      navigate("/login", { replace: true });
    } catch (err) {
      if (!err?.response) {
        toast.error("No Server Response");
      } else if (err.response?.status === 400) {
        if (err.response?.data?.email) {
          toast.error("Email Already Taken");
        } else if (err.response?.data?.username) {
          toast.error("Username Taken");
        } else {
          toast.error("Registration Failed");
        }
      } else {
        toast.error("Registration Failed");
      }
    }
  };

  return (
    <div className="page-container w-full h-screen flex items-center justify-center bg-cover bg-center">
      <section className="registration-section flex flex-col items-center justify-center w-1/3 h-2/3 text-white">
        <h1 className="mb-2">REGISTER</h1>
        <img src={solvroLogo} alt="Solvro Logo" className="solvroImg w-7/10 mb-2" />
        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center px-8 py-4">
          <div className="label-input-section flex flex-col mb-4 w-full relative">
            <label htmlFor="userName" className="mb-1 h-8 flex items-center">
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
              className="w-full h-12 rounded-md text-lg p-2 text-black bg-[#808796] border-3 border-transparent focus:outline-none focus:border-black"
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
              className={`tooltip ${userFocus && user && !validUser ? "" : "offscreen"}`}
            >
              4 to 24 characters. <br />
              Must begin with a letter. <br />
              Letters, numbers, underscores, hyphens allowed.
            </p>
          </div>
          <div className="label-input-section flex flex-col mb-2 w-full relative">
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
              className="w-full h-12 rounded-md text-lg p-2 text-black bg-[#808796] border-3 border-transparent focus:outline-none focus:border-black"
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
          <div className="flex flex-row-custom w-full space-x-4 mb-8">
            <div className="label-input-section flex flex-col w-1/2 relative">
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
                className="w-full h-12 rounded-md text-lg p-2 text-black bg-[#808796] border-3 border-transparent focus:outline-none focus:border-black"
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
                className={`tooltip ${nameFocus && name && !validName ? "" : "offscreen"}`}
              >
                Cannot contain numbers. <br />
                At least 1 letter long. <br />
                Hyphens allowed.
              </p>
            </div>
            <div className="label-input-section flex flex-col w-1/2 relative">
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
                className="w-full h-12 rounded-md text-lg p-2 text-black bg-[#808796] border-3 border-transparent focus:outline-none focus:border-black"
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
                className={`tooltip ${lnameFocus && lname && !validLname ? "" : "offscreen"}`}
              >
                Cannot contain numbers. <br />
                At least 1 letter long. <br />
                Hyphens allowed.
              </p>
            </div>
          </div>
          <div className="flex flex-row-custom w-full space-x-4 mb-8">
            <div className="label-input-section flex flex-col w-1/2 relative">
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
                className="w-full h-12 rounded-md text-lg p-2 text-black bg-[#808796] border-3 border-transparent focus:outline-none focus:border-black"
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
                className={`tooltip ${pwdFocus && !validPwd ? "instructions" : "offscreen"}`}
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
            <div className="label-input-section flex flex-col w-1/2 relative">
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
                className="w-full h-12 rounded-md text-lg p-2 text-black bg-[#808796] border-3 border-transparent focus:outline-none focus:border-black"
                autoComplete="new-password"
                onChange={(e) => setMatchPwd(e.target.value)}
                required
                value={matchPwd}
                aria-invalid={validMatch ? "false" : "true"}
                aria-describedby="confirmnote"
                onFocus={() => setMatchFocus(true)}
                onBlur={() => setMatchFocus(false)}
                placeholder="Enter your password again"
              />
              <p
                id="confirmnote"
                className={`tooltip ${matchFocus && !validMatch ? "instructions" : "offscreen"}`}
              >
                Must match the first password input field.
              </p>
            </div>
          </div>

          <button
            disabled={!validUser || !validEmail || !validName || !validLname || !validPwd || !validMatch}
            className="sign-in-button w-4/5 h-12 rounded-md text-xl bg-[#152959] hover:bg-[#061527] text-white transition-all duration-300 ease-in-out"
          >
            Sign Up
          </button>
        </form>
        <div className="info-container mt-4">
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
