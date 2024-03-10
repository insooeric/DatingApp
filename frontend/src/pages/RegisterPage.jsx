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
      navigate("/");
    } catch (err) {
      toast.error("Please fill in all of the fields.");
    }
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  return (
    <>
      <div className="loginPage">
        Register Page
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
          <div className="form-group">
            <label className="input-label">Confirm Password</label>
            <input
              type="text"
              placeholder="*******"
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input-text"
            />
          </div>

          <div className="bottom-panel">
            <button type="submit" className="login-btn">
              Register
            </button>
            <br />
            Already a member?
            <Link to="/login">
              <button>Login</button>
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default RegisterPage;
