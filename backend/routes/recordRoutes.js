import express from "express";
import {
  getUserRecord,
  postUserRecord,
  get6RandomRecords,
  getAllRecords,
  postRateUser,
} from "../controllers/recordController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// router.route("/getRecord").get(protect, getUserRecord);
router
  .route("/")
  .get(protect, getUserRecord)
  .post(protect, postUserRecord)
  .put(protect);
router.route("/rate-user").post(protect, postRateUser);
router.route("/all-records").get(protect, getAllRecords);
router.get("/6-random-record", get6RandomRecords);
export default router;
