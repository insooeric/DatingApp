/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { NavDropdown } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../slices/usersApiSlice";
import { FaSignInAlt } from "react-icons/fa";
import { logout } from "../slices/authSlice";
import navLogo from "../image/bannerLogo.png";

const NavBar = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/");
    } catch (error) {
      console.log("Couldn't logout");
    }
  };

  const profileHandler = async () => {
    navigate("/settings");
  };

  useEffect(() => {}, []);

  return (
    <>
      <div className="nav">
        <Link className="logo" to="/">
          <img src={navLogo} style={{ width: 100 }} />
        </Link>
        <div className="tabs">
          <ul className="nav-list">
            <li>
              <Link className="nav-item" to={"/"}>
                Home
              </Link>
            </li>
            <li>
              <Link className="nav-item" to={"/browse"}>
                Browse
              </Link>
            </li>
            {/* <li>
              <Link className="nav-item" to={"/"}>
                Default
              </Link>
            </li> */}
          </ul>
        </div>
        <div className="login">
          {userInfo ? (
            <>
              <NavDropdown title={userInfo.name} id="username">
                <NavDropdown.Item onClick={profileHandler}>
                  Settings
                </NavDropdown.Item>
                <NavDropdown.Item onClick={logoutHandler}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            </>
          ) : (
            <Link className="nav-link" to={"/login"}>
              <div className="nav-signin-pc">
                <FaSignInAlt /> Sign In
              </div>
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default NavBar;
