import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../slices/authSlice";
import { useUpdateUserMutation } from "../slices/usersApiSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const UpdateProfileComp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { userInfo } = useSelector((state) => state.auth);
  const [updateProfile] = useUpdateUserMutation();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const profileHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await updateProfile({
        _id: userInfo._id,
        name,
        email,
        checkPassword: password,
      }).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success("Profile updated");
      navigate("/settings");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const passwordHandler = async (e) => {
    e.preventDefault();
    if (newPassword == confirmPassword) {
      try {
        const res = await updateProfile({
          email: userInfo.email,
          checkPassword: password,
          password: newPassword,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success("Profile updated");
        navigate("/settings");
      } catch (err) {
        toast.error("Invalid Password");
      }
    } else {
      toast.error("Password doesn't match");
    }
  };

  useEffect(() => {
    sessionStorage.setItem("userName", userInfo.name);
    setName(userInfo.name);
    setEmail(userInfo.email);
  }, []);

  return (
    <>
      <div className="profile-page">
        <div className="wrapper">
          <form onSubmit={profileHandler}>
            <h2 className="form-header">Edit Profile</h2>
            <div className="form-grp">
              <label>Full Name</label>
              <input
                type="text"
                className="update-input"
                placeholder={userInfo.name}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-grp">
              <label>Email</label>
              <input
                type="email"
                className="update-input"
                placeholder={userInfo.email}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-grp">
              <label>Password</label>
              <input
                type="password"
                className="update-input"
                placeholder="Confirm password before update"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="form-grp">
              <button type="submit" className="update-btn" value="Submit">
                Update
              </button>
            </div>
          </form>
        </div>
        <div className="wrapper">
          <form onSubmit={passwordHandler}>
            <h2 className="form-header">Change Password</h2>
            <div className="form-grp">
              <label>Current Password</label>
              <input
                type="password"
                className="update-input"
                placeholder="Old Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="form-grp">
              <label>New Password</label>
              <input
                type="password"
                className="update-input"
                placeholder="New Password"
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="form-grp">
              <label>Confirm Password</label>
              <input
                type="password"
                className="update-input"
                placeholder="Confirm Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div className="form-grp">
              <button type="submit" className="update-btn" value="Submit">
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default UpdateProfileComp;
