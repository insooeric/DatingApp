/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import {
  useGetUserRecordMutation,
  // usePostUserRecordMutation,
} from "../slices/recordsApiSlice.js";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const InitialSettingPage = () => {
  const [formData, setFormData] = useState({
    age: "",
    height: 0,
    weight: 0,
    gender: "",
    identity: "",
    targetGender: "",
    interests: [],
    bio: "",
    interest: "",
  });

  const [dataFetched, setDataFetched] = useState(false); // New state variable

  const [getUserRecord] = useGetUserRecordMutation();
  // const [postUserRecord] = usePostUserRecordMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [e.target.name]:
        e.target.name === "height" || e.target.name === "weight"
          ? parseFloat(e.target.value) // Convert to float for height and weight
          : e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tmp_info = {
        userName: userInfo.name,
        age: formData.age,
        height: formData.height,
        weight: formData.weight,
        gender: formData.gender,
        identification: formData.identity,
        interestGender: formData.targetGender,
        interests: formData.interests,
      };
      console.log(tmp_info);
      sessionStorage.setItem("info", JSON.stringify(tmp_info));
      navigate("/set-location");
    } catch (err) {
      console.log("failed post");
    }
    // For demonstration purposes, logging the form data
    console.log("Form Data:", formData);
  };

  const handleInterestAdd = () => {
    if (!formData.interest.trim()) {
      // If the interest is empty or contains only whitespace, do not add it
      return;
    }
    if (formData.interests.includes(formData.interest)) {
      // Handle duplicate interest, show error or ignore
      return;
    }

    setFormData({
      ...formData,
      interests: [...formData.interests, formData.interest],
      interest: "", // Clear the input field after adding
    });
  };

  const getAccordingUserRecord = async () => {
    try {
      const res = await getUserRecord({});
      console.log(res);
      if (res.data) {
        alert("invalid");
        navigate("/");
      }
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    } finally {
      // Set dataFetched to true after the request is complete
      setDataFetched(true);
    }
  };

  useEffect(() => {
    getAccordingUserRecord();
  }, []);

  // Render the component only if dataFetched is true
  if (!dataFetched) {
    return null; // or a loading indicator
  }

  return (
    <>
      <div className="initial-setting-page">
        <div className="title">
          Welcome {userInfo.name}!
          <br />
          In order for us to manage you better,
          <br />
          Please complete the following process
        </div>
        <div className="container">
          <form onSubmit={handleSubmit}>
            <label>
              I am:
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </label>
            years old{" "}
            <label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="nonBinary">Non-binary</option>
              </select>
            </label>{" "}
            identified as{" "}
            <label>
              <select
                name="identity"
                value={formData.identity}
                onChange={handleChange}
                required
              >
                <option value="">Select Identity</option>
                <option value="hetrosexual">Heterosexual</option>
                <option value="lesbian">Lesbian</option>
                <option value="gay">Gay</option>
                <option value="bisexual">Bisexual</option>
                <option value="transgender">Transgender</option>
              </select>
            </label>{" "}
            (Person) looking for
            <label>
              <select
                name="targetGender"
                value={formData.targetGender}
                onChange={handleChange}
                required
              >
                <option value="">Select Target</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </label>
            <br />
            <label>
              Height (in cm):
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                required
              />
            </label>{" "}
            <label>
              Weight (in kg):
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                required
              />
            </label>
            <br />
            My interests are:{" "}
            <label>
              <input
                type="text"
                name="interest"
                value={formData.interest}
                onChange={handleChange}
              />
              <button
                className="add-interest-btn"
                type="button"
                onClick={handleInterestAdd}
              >
                +
              </button>
            </label>
            <div>
              {formData.interests.map((interest, index) => (
                <span key={index}>{interest} </span>
              ))}
            </div>
            <br />
            Speaking about me:
            <br />
            <label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="4"
              ></textarea>
            </label>
            <br />
            <button className="initial-continue-btn" type="submit">
              Continue
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default InitialSettingPage;
