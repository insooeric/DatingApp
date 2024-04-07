import React, { useState, useEffect } from "react";
import { useSuspendUserMutation } from "../slices/usersApiSlice";
import { useGetAllRecordsMutation } from "../slices/recordsApiSlice";
import { useGetUserEmailMutation } from "../slices/usersApiSlice";
import { toast } from "react-toastify";

const AdminComp = () => {
  const [getAllRecords] = useGetAllRecordsMutation();
  const [getUserEmail] = useGetUserEmailMutation();
  const [suspendUser] = useSuspendUserMutation();
  const [userList, setUserList] = useState([]);
  const [suspensionDurations, setSuspensionDurations] = useState({});

  const getAccordingUserEmail = async (userId) => {
    try {
      const res = await getUserEmail({ userId });
      return res.data.email;
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const suspendSelectedUser = async (userId, days) => {
    try {
      const res = await suspendUser({ userId, days });
      console.log(res);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  useEffect(() => {
    const getAllUserRecords = async () => {
      try {
        const res = await getAllRecords();
        const usersWithEmail = await Promise.all(
          res.data.allRecords.map(async (user) => {
            const email = await getAccordingUserEmail({
              id: user.userId,
            });
            return { ...user, email }; // Adding email field to user object
          })
        );
        setUserList(usersWithEmail);
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    };

    getAllUserRecords();
  }, []);

  const handleSuspensionChange = (userId, duration) => {
    setSuspensionDurations((prevDurations) => ({
      ...prevDurations,
      [userId]: duration,
    }));
  };

  return (
    <>
      <div className="admin-comp">
        AdminComp
        <br />
        <div className="user-list">
          {userList.map((user, key) => (
            <div className="small-profile" key={key}>
              <div>
                {user.userName}
                <br />
                {user.gender}
                <br />
                {user.email}
              </div>
              <div>
                <input
                  type="number"
                  value={suspensionDurations[user.userId] || ""}
                  onChange={(e) =>
                    handleSuspensionChange(
                      user.userId,
                      parseInt(e.target.value)
                    )
                  }
                />
                <button
                  onClick={() => {
                    suspendSelectedUser(
                      user.userId,
                      suspensionDurations[user.userId]
                    );
                  }}
                >
                  Suspend
                </button>
                <button
                  onClick={() => {
                    suspendSelectedUser(user.userId, -1);
                  }}
                >
                  Delete User
                </button>
                <button
                  onClick={() => {
                    suspendSelectedUser(user.userId, 0);
                  }}
                >
                  X
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AdminComp;
