/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import {
  useGetUserRecordMutation,
  usePostUserRecordMutation,
} from "../slices/recordsApiSlice.js";
import {
  useGetCountriesMutation,
  useGetProvincesMutation,
  useGetCitiesMutation,
  useGetLatLonMutation,
} from "../slices/locationApiSlice.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const LocationSettingPage = () => {
  const [dataFetched, setDataFetched] = useState(false);
  const [userInfo, setUserInfo] = useState(
    JSON.parse(sessionStorage.getItem("info"))
  );

  const [userCountry, setUserCountry] = useState("");
  const [userProvince, setUserProvince] = useState("");
  const [userCity, setUserCity] = useState("");
  const [userLatLon, setUserLatLon] = useState();

  const [countryList, setCountryList] = useState([]);
  const [provinceList, setProvinceList] = useState([]);
  const [cityList, setCityList] = useState([]);

  const [getUserRecord] = useGetUserRecordMutation();
  const [postUserRecord] = usePostUserRecordMutation();
  const [getCountries] = useGetCountriesMutation();
  const [getProvinces] = useGetProvincesMutation();
  const [getCities] = useGetCitiesMutation();
  const [getLatLon] = useGetLatLonMutation();

  const navigate = useNavigate();

  const getAccordingUserRecord = async () => {
    try {
      const res = await getUserRecord({});
      if (res.data.record.location) {
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
        // Use localeCompare for case-insensitive sorting
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userCountry || !userProvince || !userCity) {
      toast.error("Please select your country, province, and city.");
      return;
    }
    sessionStorage.clear();
    try {
      const res = await postUserRecord({
        userName: userInfo.userName,
        age: userInfo.age,
        height: userInfo.height,
        weight: userInfo.weight,
        gender: userInfo.gender,
        location: {
          country: userCountry,
          province: userProvince,
          city: userCity,
          geoLocation: {
            lat: userLatLon.lat,
            lon: userLatLon.lon,
          },
        },
        identification: userInfo.identification,
        interestGender: userInfo.interestGender,
        interests: userInfo.interests,
      }).unwrap();
      // const test = {
      //   userName: userInfo.userName,
      //   age: userInfo.age,
      //   height: userInfo.height,
      //   weight: userInfo.weight,
      //   gender: userInfo.gender,
      //   location: {
      //     country: userCountry,
      //     province: userProvince,
      //     city: userCity,
      //     geoLocation: {
      //       lat: userLatLon.lat,
      //       lon: userLatLon.lon,
      //     },
      //   },
      //   identification: userInfo.identification,
      //   interestGender: userInfo.interestGender,
      //   interests: userInfo.interests,
      // };

      // console.log(test);

      toast.success("Profile added");
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAccordingUserRecord();
    getAllCountries();
    // getAccordingProvinces();
    // getAccordingCities();
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

  if (!dataFetched) {
    return null; // or a loading indicator
  }
  return (
    <>
      <div className="location-setting-page">
        <h2>Location Setting</h2>
        <form className="location-form" onSubmit={handleSubmit}>
          <label>User Country:</label>
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

          <label>User Province:</label>
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

          <label>User City:</label>
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
          <button type="submit">Register</button>
        </form>
      </div>
    </>
  );
};

export default LocationSettingPage;
