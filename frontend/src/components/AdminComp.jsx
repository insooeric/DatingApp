import { useState, useEffect } from "react";
import {
  useSuspendUserMutation,
  useGetUserEmailMutation,
} from "../slices/usersApiSlice";
import { useGetAllRecordsMutation } from "../slices/recordsApiSlice";
import { toast } from "react-toastify";

const AdminComp = () => {
  const [getAllRecords] = useGetAllRecordsMutation();
  const [suspendUser] = useSuspendUserMutation();
  const [getSelectedUserEmail] = useGetUserEmailMutation();
  const [userList, setUserList] = useState([]);
  const [suspensionDurations, setSuspensionDurations] = useState({});

  const suspendSelectedUser = async (userId, days) => {
    try {
      const res = await suspendUser({ userId, days });
      console.log(res);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const calculateAverageRating = (ratings) => {
    if (ratings.length === 0) return 0;
    const total = ratings.reduce((acc, item) => acc + item.rating, 0);
    return total / ratings.length;
  };

  const handleSuspensionChange = (userId, duration) => {
    setSuspensionDurations((prevDurations) => ({
      ...prevDurations,
      [userId]: duration,
    }));
  };

  useEffect(() => {
    const getAllUserRecords = async () => {
      try {
        const recordsRes = await getAllRecords();
        if (recordsRes.error) {
          throw new Error(recordsRes.error.message);
        }

        const usersWithEmails = await Promise.all(
          recordsRes.data.allRecords.map(async (user) => {
            try {
              const emailRes = await getSelectedUserEmail({
                id: user.userId,
              });
              return {
                ...user,
                averageRating: calculateAverageRating(user.myRating),
                email: emailRes.data.email,
              };
            } catch (emailError) {
              return {
                ...user,
                averageRating: calculateAverageRating(user.myRating),
                email: "Email not found",
              };
            }
          })
        );

        setUserList(usersWithEmails);
      } catch (err) {
        toast.error("Failed to fetch user records: " + err.message);
      }
    };

    getAllUserRecords();
  }, []);

  return (
    <>
      <div className="admin-comp">
        <h2>AdminComp</h2>
        <br />
        <div className="user-list">
          {userList.map((user, key) => (
            <div className="small-profile" key={key}>
              <div>
                {user.userName} ({user.averageRating.toFixed(1)} avg rating)
                <br />
                {user.gender}
                <br />
                Email: {user.email}
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
