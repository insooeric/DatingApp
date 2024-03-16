/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useLoginMutation, useRegisterMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  const loginHandler = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      toast.error("Invalid Email format");
      return;
    }

    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate("/");
    } catch (err) {
      toast.error("Invalid Email or Password");
    }
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  return (
    <>
      <div className="loginPage">
        <h2 className="loginTitle">Login</h2>
        <form onSubmit={loginHandler}>
          <div className="input-field">
            <label className="input-label">User Email</label>
            <input
              type="text"
              placeholder="Please type email"
              onChange={(e) => setEmail(e.target.value)}
              className="input-text"
            />
          </div>
          <div className="form-group">
            <label className="input-label">Password</label>
            <input
              type="text"
              placeholder="*******"
              onChange={(e) => setPassword(e.target.value)}
              className="input-text"
            />
          </div>

          <div className="bottom-panel">
            <button type="submit" className="login-btn">
              Login
            </button>
            <br />
            {/* Not a member? */}
            <Link to="/tier">
              <button className="register-btn">Register</button>
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default LoginPage;
