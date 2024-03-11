import asyncHandler from "express-async-handler";
import { User, Record } from "../models/dbModel.js";

// @desc    Get user records for according user
// route    Get /api/record/
// @access  Private

const getUserRecord = asyncHandler(async (req, res) => {
  try {
    const record = await Record.findOne({
      userId: req.user._id,
    });

    if (!record) {
      return res.status(204).json({});
    }

    res.status(200).json({ record });
  } catch (err) {
    console.error(err);
    res.status(404).json({ msg: "Unable to retrieve user record" });
  }
});

const postUserRecord = asyncHandler(async (req, res) => {
  const {
    userName,
    age,
    weight,
    height,
    gender,
    location,
    identification,
    interestGender,
    interests,
  } = req.body;

  console.log(req.body);
  try {
    // Check if a record with the given userId already exists
    const existingRecord = await Record.findOne({ userId: req.user._id });

    if (existingRecord) {
      return res.status(200).json({
        msg: "Record for this user already exists",
      });
    }

    // Create a new record
    const newRecord = new Record({
      userId: req.user._id,
      userName,
      age,
      weight,
      height,
      gender,
      location,
      identification,
      interestGender,
      interests,
    });

    // Save the new record to the database
    await newRecord.save();

    res.status(200).json({
      record: newRecord,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      msg: "Failed adding record",
    });
  }
});

export { getUserRecord, postUserRecord };
