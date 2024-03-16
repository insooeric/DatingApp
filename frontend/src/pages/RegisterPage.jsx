/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useRegisterMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [register] = useRegisterMutation();

  const registerHandler = async (e) => {
    e.preventDefault();

    if (name.length < 2) {
      toast.error("Name should be at least 2 characters");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Email is invalid");
      return;
    }

    if (
      password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/\d/.test(password)
    ) {
      toast.error(
        "Password should contain folowings: at least 8 characters, one capital letter, one number",
        { autoClose: 5000 }
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await register({ name, email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate("/welcome");
    } catch (err) {
      console.log(err);
      toast.error(`${err.data.message}`);
    }
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  return (
    <>
      <div className="loginPage">
        <h2>Register</h2>
        <form onSubmit={registerHandler}>
          <div className="input-field">
            <label className="input-label">User Name</label>
            <input
              type="text"
              placeholder="Please type name"
              onChange={(e) => setName(e.target.value)}
              className="input-text"
            />
          </div>
          <div className="input-field">
            <label className="input-label">Email</label>
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
          <div className="form-group">
            <label className="input-label">Confirm Password</label>
            <input
              type="text"
              placeholder="*******"
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input-text"
            />
          </div>

          <div className="bottom-panel-register">
            <button type="submit" className="register-btn">
              Register
            </button>
            <br />
            <p className="login-btn-text">Already a member?</p>
            <Link to="/login">
              <button className="login-btn">Login</button>
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default RegisterPage;
