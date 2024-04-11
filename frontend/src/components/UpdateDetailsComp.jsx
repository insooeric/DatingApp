import { useEffect, useReducer, useState } from "react";
import {
  useGetUserRecordMutation,
  usePostUserRecordMutation,
} from "../slices/recordsApiSlice";
import {
  useGetCountriesMutation,
  useGetProvincesMutation,
  useGetCitiesMutation,
  useGetLatLonMutation,
} from "../slices/locationApiSlice.js";
import { toast } from "react-toastify";

const UpdateDetailsComp = () => {
  const initialState = {
    userName: sessionStorage.getItem("userName"),
    age: 0,
    height: 0,
    weight: 0,
    location: {},
    gender: "",
    identification: "",
    transGender: true,
    interestGender: "",
    interests: [],
    bio: "",
  };

  const reducer = (state, newState) => ({ ...state, ...newState });
  const [formData, setFormData] = useReducer(reducer, initialState);
  const [interest, setInterest] = useState("");

  const [countryList, setCountryList] = useState([]);
  const [provinceList, setProvinceList] = useState([]);
  const [cityList, setCityList] = useState([]);

  const [getUserRecord] = useGetUserRecordMutation();
  const [updateUserRecord] = usePostUserRecordMutation();

  const [getCountries] = useGetCountriesMutation();
  const [getProvinces] = useGetProvincesMutation();
  const [getCities] = useGetCitiesMutation();
  const [getLatLon] = useGetLatLonMutation();

  const [userCountry, setUserCountry] = useState("");
  const [userProvince, setUserProvince] = useState("");
  const [userCity, setUserCity] = useState("");
  const [userLatLon, setUserLatLon] = useState();

  const loadUserRecord = async () => {
    try {
      const res = await getUserRecord({});
      const {
        age,
        bio,
        gender,
        height,
        identification,
        interestGender,
        interests,
        location,
        transGender,
        weight,
      } = res.data.record;

      console.log(res.data.record.location);
      setUserCountry(res.data.record.location.country);
      setUserProvince(res.data.record.location.province);
      setUserCity(res.data.record.location.city);
      setFormData({
        age,
        height,
        weight,
        location,
        gender,
        identification,
        transGender,
        interestGender,
        interests,
        bio,
      });
    } catch (err) {
      toast.error("Unable to load user.");
    }
  };

  const getAllCountries = async () => {
    try {
      const res = await getCountries();
      setCountryList(res.data.countries);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const getAccordingProvinces = async () => {
    try {
      const res = await getProvinces({ country: userCountry });
      setProvinceList(res.data.admin1);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const getAccordingCities = async () => {
    try {
      const res = await getCities({
        country: userCountry,
        province: userProvince,
      });

      const sortedCities = res.data.cities.slice().sort((city1, city2) => {
        return city1.name.localeCompare(city2.name);
      });

      setCityList(sortedCities);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const getPosition = async () => {
    try {
      const res = await getLatLon({
        country: userCountry,
        province: userProvince,
        city: userCity,
      });

      if (res.data.geoLocation) {
        const latNum = parseFloat(res.data.geoLocation.lat);
        const lonNum = parseFloat(res.data.geoLocation.lon);
        const newData = {
          lat: latNum,
          lon: lonNum,
        };
        console.log(newData);
        setUserLatLon(newData);
      } else {
        setUserLatLon({
          lat: null,
          lon: null,
        });
      }
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);

    try {
      const res = await updateUserRecord(formData);
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleInterestAdd = () => {
    if (!interest.trim()) {
      // If the interest is empty or contains only whitespace, do not add it
      return;
    }
    if (formData.interests.includes(interest)) {
      // Handle duplicate interest, show error or ignore
      return;
    }
    console.log(interest);
    setFormData({
      ...formData,
      interests: [...formData.interests, interest],
    });
    setInterest("");
  };

  useEffect(() => {
    loadUserRecord();
    getAllCountries();
  }, []);

  useEffect(() => {
    getAccordingProvinces();
    setTimeout(() => {
      setUserProvince("");
      setUserCity("");
    }, 0);
  }, [userCountry]);

  useEffect(() => {
    getAccordingCities();
    setTimeout(() => {
      setUserCity("");
    }, 0);
  }, [userProvince]);

  useEffect(() => {
    getPosition();
  }, [userCity]);

  useEffect(() => {
    if (userCountry && userProvince && userCity && userLatLon) {
      setFormData({
        location: {
          country: userCountry,
          province: userProvince,
          city: userCity,
          geoLocation: {
            lat: userLatLon.lat,
            lon: userLatLon.lon,
          },
        },
      });
      console.log(formData);
    }
  }, [userCountry, userProvince, userCity, userLatLon]);

  return (
    <>
      <div className="update-details-comp">
        <h2>UpdateDetails</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Age
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
            />
          </label>
          <br />
          Gender
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
          </label>
          <br />
          Identification
          <label>
            <select
              name="identification"
              value={formData.identification}
              onChange={handleChange}
              required
            >
              <option value="">Select Identity</option>
              <option value="heterosexual">Heterosexual</option>
              <option value="lesbian">Lesbian</option>
              <option value="gay">Gay</option>
              <option value="bisexual">Bisexual</option>
              <option value="transgender">Transgender</option>
            </select>
          </label>
          <br />
          Transgender
          <label>
            <select
              name="transGender"
              value={formData.transGender}
              onChange={handleChange}
              required
            >
              <option value="">Select Yes/No</option>
              <option value={true}>Yes</option>
              <option value={false}>No</option>
            </select>
          </label>
          <br />
          Gender looking for
          <label>
            <select
              name="interestGender"
              value={formData.interestGender}
              onChange={handleChange}
              required
            >
              <option value="">Select Target</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="all">All</option>
            </select>
          </label>
          <br />
          <label>
            Height (cm)
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleChange}
              required
            />
          </label>
          <br />
          <label>
            Weight (kg)
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              required
            />
          </label>
          <br />
          My interests
          <label>
            <input
              type="text"
              name="interest"
              value={interest}
              onChange={(e) => {
                setInterest(e.target.value);
              }}
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
              <span
                key={index}
                onClick={() => {
                  const updatedInterests = formData.interests.filter(
                    (_, i) => i !== index
                  );
                  setFormData({ ...formData, interests: updatedInterests });
                }}
              >
                {interest}{" "}
              </span>
            ))}
          </div>
          <br />
          Bio
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
          <label>User Location:</label>
          <br />
          <select
            value={userCountry}
            onChange={(e) => setUserCountry(e.target.value)}
          >
            <option value="">Select Country</option>
            {countryList.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
          <br />
          <select
            value={userProvince}
            onChange={(e) => setUserProvince(e.target.value)}
            disabled={userCountry === ""} // Disable when userCountry is default
          >
            <option value="">Select Province</option>
            {provinceList.map((province) => (
              <option key={province} value={province}>
                {province}
              </option>
            ))}
          </select>
          <br />
          <select
            value={userCity}
            onChange={(e) => setUserCity(e.target.value)}
            disabled={userCountry === "" || userProvince === ""} // Disable when userProvince or userCountry is default
          >
            <option value="">Select City</option>
            {cityList.map((city) => (
              <option key={city._id} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
          <br />
          <button className="initial-continue-btn" type="submit">
            Update
          </button>
        </form>
      </div>
    </>
  );
};

export default UpdateDetailsComp;
