import express from "express";
import {
  getCountries,
  postProvinces,
  postCities,
  postLonLat,
} from "../controllers/locationController.js";

const router = express.Router();

// router.get("/changecode", updateCode);
router.get("/countries", getCountries);
router.post("/provinces", postProvinces);
router.post("/cities", postCities);
router.post("/geo-location", postLonLat);
export default router;
