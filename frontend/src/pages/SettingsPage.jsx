import { useState } from "react";
import UpdateProfileComp from "../components/UpdateProfileComp";
import UpdateDetailsComp from "../components/UpdateDetailsComp";
import AdminComp from "../components/AdminComp";
import { useGetUserMutation } from "../slices/usersApiSlice";
import { toast } from "react-toastify";

const SettingsPage = () => {
  const [contentComponent, setContentComponent] = useState(
    <UpdateProfileComp />
  );
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLinkClick = (component) => {
    setContentComponent(component);
  };

  const [getUser] = useGetUserMutation();

  const getCurrentUser = async () => {
    try {
      const res = await getUser();
      if (res.data.role === "admin") {
        console.log("_admin");
        setIsAdmin(true);
      }
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  useState(() => {
    getCurrentUser();
  }, []);

  return (
    <>
      <div className="settings-page">
        <div className="sidebar">
          <div
            className="sidebar-link"
            onClick={() => handleLinkClick(<UpdateProfileComp />)}
          >
            Profile
          </div>
          <div
            className="sidebar-link"
            onClick={() => handleLinkClick(<UpdateDetailsComp />)}
          >
            Details
          </div>
          {isAdmin && (
            <>
              <div
                className="sidebar-link"
                onClick={() => handleLinkClick(<AdminComp />)}
              >
                Admin
              </div>
            </>
          )}
        </div>
        <div className="content">{contentComponent}</div>
      </div>
    </>
  );
};

export default SettingsPage;
