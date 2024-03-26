/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  useGetRandomUserRecordMutation,
  useGetAllRecordsMutation,
  useGetUserRecordMutation,
} from "../slices/recordsApiSlice";
import { useGetUserEmailQuery } from "../slices/usersApiSlice";
import { Link } from "react-router-dom";

const SearchPage = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const [getRandomUserRecord] = useGetRandomUserRecordMutation();
  const [getAllUserRecord] = useGetAllRecordsMutation();
  const [getCurrentUserRecord] = useGetUserRecordMutation();
  const [userList, setUserList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchOption, setSearchOption] = useState("default");
  const [userRecord, setUserRecord] = useState();
  const usersPerPage = 6;

  const [selectedUserId, setSelectedUserId] = useState(null);
  const [userEmail, setUserEmail] = useState("");

  const get6RandomUsers = async () => {
    try {
      const res = await getRandomUserRecord({});
      setUserList(res.data.selectedRecords);
    } catch (err) {
      console.log(err);
    }
  };

  const { data, isSuccess } = useGetUserEmailQuery(selectedUserId, {
    skip: selectedUserId === null,
  });

  const getAllUsers = async () => {
    try {
      const res = await getAllUserRecord({});
      // console.log(res.data.allRecords);
      setUserList(res.data.allRecords);
    } catch (err) {
      console.log(err);
    }
  };

  const getCurrentUser = async () => {
    try {
      const res = await getCurrentUserRecord({});
      setUserRecord(res.data.record);
    } catch (err) {
      console.log(err);
    }
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = userList.slice(indexOfFirstUser, indexOfLastUser);

  const nextPage = () => {
    if (indexOfLastUser < userList.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    if (userInfo) {
      console.log("user logged in");
      getCurrentUser();
      getAllUsers();
    } else {
      console.log("user NOT logged in");
      get6RandomUsers();
    }
  }, []);

  useEffect(() => {
    if (isSuccess && data) {
      setUserEmail(data.email);
      console.log(`User's email: ${data.email}`);
    }
  }, [data, isSuccess]);

  useEffect(() => {
    let sortedUsers = [];
    if (userRecord && userList.length > 0) {
      console.log("search option changed. current: " + searchOption);
      switch (searchOption) {
        case "closeToYou":
          sortedUsers = userList.slice().sort((a, b) => {
            const distanceA = calculateDistance(userRecord, a);
            const distanceB = calculateDistance(userRecord, b);
            return distanceA - distanceB;
          });
          setUserList(sortedUsers);
          break;
        case "bestMatch":
          sortedUsers = userList.slice().sort((a, b) => {
            const commonInterestsA = userRecord.interests.filter((interest) =>
              a.interests.includes(interest)
            ).length;
            const commonInterestsB = userRecord.interests.filter((interest) =>
              b.interests.includes(interest)
            ).length;

            if (commonInterestsA !== commonInterestsB) {
              return commonInterestsB - commonInterestsA;
            } else {
              const partOfInterestA = userRecord.interests.find((interestA) =>
                a.interests.some((interestB) => interestB.includes(interestA))
              );
              const partOfInterestB = userRecord.interests.find((interestA) =>
                b.interests.some((interestB) => interestB.includes(interestA))
              );

              if (partOfInterestA && partOfInterestB) {
                return partOfInterestB.length - partOfInterestA.length;
              } else if (partOfInterestA) {
                return -1;
              } else if (partOfInterestB) {
                return 1;
              } else {
                return 0;
              }
            }
          });
          setUserList(sortedUsers);
          break;
      }
    }
  }, [searchOption]);

  const calculateDistance = (currentUser, compUser) => {
    const lat1 = currentUser.location.geoLocation.lat;
    const lon1 = currentUser.location.geoLocation.lon;
    const lat2 = compUser.location.geoLocation.lat;
    const lon2 = compUser.location.geoLocation.lon;

    var R = 6371;
    var dLat = deg2rad(lat2 - lat1);
    var dLon = deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  return (
    <>
      <div className="search-page">
        <h2>SearchPage</h2>
        <br />
        {userInfo ? (
          <div id="radio-btns-div">
            <input
              type="radio"
              id="closeToYou"
              name="searchOption"
              value="closeToYou"
              checked={searchOption === "closeToYou"}
              onChange={() => setSearchOption("closeToYou")}
            />
            <label htmlFor="closeToYou">Close to you</label>

            <input
              type="radio"
              id="bestMatch"
              name="searchOption"
              value="bestMatch"
              checked={searchOption === "bestMatch"}
              onChange={() => setSearchOption("bestMatch")}
            />
            <label htmlFor="bestMatch">Best match</label>
          </div>
        ) : (
          <div></div>
        )}

        <br />
        <div className="user-container">
          {currentUsers.map((user, index) => (
            <div className="user-card" key={index}>
              <div className="small-profile">
                <div className="left-side">
                  <label>{user.userName}</label>
                  <label>Age: {user.age}</label>
                  <label>Gender: {user.gender}</label>
                </div>
                <div className="right-side">
                  <p>{user.bio}</p>
                  {user.interests &&
                    user.interests
                      .slice(0, 3)
                      .map((interest, i) => <span key={i}>{interest}</span>)}
                </div>
              </div>
              <button
                className="contact-btn"
                onClick={() => setSelectedUserId(user.userID)}
                //THIS WORKS WHICH MEANS I JUST NEED THE ACTUAL ID OF THE USER IN THE "RECORDS" TABLE
                // onClick={() => setSelectedUserId("65f76e8eb1a158d124675327")}
              >
                Contact
              </button>
            </div>
          ))}
        </div>
        <div className="btn-group">
          <button onClick={prevPage} disabled={currentPage === 1}>
            Previous
          </button>
          <span>Page {currentPage}</span>
          <button
            onClick={nextPage}
            disabled={indexOfLastUser >= userList.length}
          >
            Next
          </button>
        </div>
        <br />
        {!userInfo ? (
          <div>
            Login or Register to unlock features
            <br />
            <Link to="/login">Login</Link>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </>
  );
};

export default SearchPage;
