import express from "express";
import {
  getUserRecord,
  postUserRecord,
} from "../controllers/recordController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// router.route("/getRecord").get(protect, getUserRecord);
router
  .route("/")
  .get(protect, getUserRecord)
  .post(protect, postUserRecord)
  .put(protect);
export default router;
