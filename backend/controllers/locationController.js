import asyncHandler from "express-async-handler";
import fs from "fs";
import path from "path";
import { City } from "../models/dbModel.js";

const updateCode = asyncHandler(async (req, res) => {
  try {
    const countriesData = await City.find();

    // Your country code to name mapping JSON
    const countryCodeToName = {};

    // Update the "country" field in MongoDB using updateMany
    const updatePromises = countriesData.map(async (city) => {
      const countryName = countryCodeToName[city.country] || city.country;
      await City.updateMany(
        { _id: city._id }, // Assuming _id is the unique identifier for your documents
        { $set: { country: countryName } }
      );
    });

    // Wait for all update operations to complete
    await Promise.all(updatePromises);

    res.status(200).json({ msg: "Success" });
  } catch (err) {
    console.error(err);
    res.status(404).json({ msg: "Unable to retrieve country values" });
  }
});

// @desc    Get province for country
// route    Get /api/countries/
// @access  public

const getCountries = asyncHandler(async (req, res) => {
  try {
    const distinctcountries = await City.distinct("country");

    console.log(distinctcountries.length);

    if (!distinctcountries || distinctcountries.length === 0) {
      return res.status(204).json({});
    }

    res.status(200).json({ countries: distinctcountries });
  } catch (err) {
    console.error(err);
    res.status(404).json({ msg: "Unable to retrieve country values" });
  }
});

// @desc    POST province for country
// route    POST /api/provinces/
// @access  public

const postProvinces = asyncHandler(async (req, res) => {
  const { country } = req.body;

  try {
    const distinctAdmin1s = await City.distinct("admin1", { country });

    console.log(distinctAdmin1s.length);

    if (!distinctAdmin1s || distinctAdmin1s.length === 0) {
      return res.status(204).json({});
    }

    res.status(200).json({ admin1: distinctAdmin1s });
  } catch (err) {
    console.error(err);
    res.status(404).json({ msg: "Unable to retrieve admin1 values" });
  }
});

// @desc    POST cities for province
// route    POST /api/cities/
// @access  public

const postCities = asyncHandler(async (req, res) => {
  const { country, province } = req.body;
  try {
    const cities = await City.find({ country, admin1: province }, "name");

    console.log(cities.length);

    if (!cities || cities.length === 0) {
      return res.status(204).json({});
    }

    res.status(200).json({ cities });
  } catch (err) {
    console.error(err);
    res.status(404).json({ msg: "Unable to retrieve cities values" });
  }
});

// @desc    POST cities for province
// route    POST /api/geo-location/
// @access  public

const postLonLat = asyncHandler(async (req, res) => {
  const { country, province, city } = req.body;

  try {
    const resultCity = await City.findOne({
      country,
      admin1: province,
      name: city,
    });

    if (!resultCity || resultCity.length === 0) {
      return res.status(204).json({});
    }

    const geoLocation = {
      lat: resultCity.lat,
      lon: resultCity.lon,
    };

    res.status(200).json({ geoLocation });
  } catch (err) {
    console.error(err);
    res.status(404).json({ msg: "Unable to retrieve cities values" });
  }
});

export { getCountries, postProvinces, postCities, postLonLat };
