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

// @desc    Post user records for according user
// route    Post /api/record/
// @access  Private
const postUserRecord = asyncHandler(async (req, res) => {
  const {
    userName,
    age,
    weight,
    height,
    gender,
    location,
    identification,
    transGender,
    interestGender,
    interests,
    bio,
  } = req.body;

  const myRating = [];
  const ratedUser = [];

  try {
    const existingRecord = await Record.findOne({ userId: req.user._id });

    if (!existingRecord) {
      console.log("Create Record");
      const newRecord = await Record.create({
        userId: req.user._id,
        userName,
        age,
        weight,
        height,
        gender,
        location,
        identification,
        transGender,
        interestGender,
        interests,
        bio,
        myRating,
        ratedUser,
      });
      res.status(200).json({
        record: newRecord,
      });
    } else {
      console.log("Update Record");
      existingRecord.userName = userName;
      existingRecord.age = age;
      existingRecord.weight = weight;
      existingRecord.height = height;
      existingRecord.gender = gender;
      existingRecord.location = location;
      existingRecord.identification = identification;
      existingRecord.transGender = transGender;
      existingRecord.interestGender = interestGender;
      existingRecord.interests = interests;
      existingRecord.bio = bio;

      const updatedRecord = await existingRecord.save();

      res.status(200).json({
        updatedRecord: updatedRecord,
      });
    }

    // // Create a new record
    // const newRecord = new Record({
    //   userId: req.user._id,
    //   userName,
    //   age,
    //   weight,
    //   height,
    //   gender,
    //   location,
    //   identification,
    //   transGender,
    //   interestGender,
    //   interests,
    //   bio,
    // });

    // // Save the new record to the database
    // await newRecord.save();

    // res.status(200).json({
    //   record: newRecord,
    // });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      msg: "Failed adding record",
    });
  }
});

// @desc    Get 6 random user records
// route    Get /api/record/
// @access  Public
const get6RandomRecords = asyncHandler(async (req, res) => {
  try {
    const adminUsers = await User.find({ role: "admin" });
    const adminUserIds = adminUsers.map((user) => user._id);
    const allRecords = await Record.find({ userId: { $nin: adminUserIds } });

    const shuffleArray = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };

    const shuffledRecords = shuffleArray(allRecords);

    const selectedRecords = shuffledRecords.slice(0, 6);

    res.status(200).json({
      msg: "Success",
      selectedRecords: selectedRecords,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      msg: "Failed getting record",
    });
  }
});

// @desc    Get 6 random user records
// route    Get /api/record/all-records
// @access  Private
const getAllRecords = asyncHandler(async (req, res) => {
  try {
    const adminUsers = await User.find({ role: "admin" });
    const adminUserIds = adminUsers.map((user) => user._id);
    const allRecords = await Record.find({ userId: { $nin: adminUserIds } });

    const filteredRecords = allRecords.filter((record) => {
      const userid = req.user?._id?.toString();
      const compid = record.userId?.toString();

      if (userid && compid) {
        if (userid === compid) {
          return false;
        }
      }
      return true;
    });

    res.status(200).json({
      msg: "Success",
      allRecords: filteredRecords,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      msg: "Failed getting record",
    });
  }
});

// @desc    Post rating for selected user
// route    Post /api/record/rate-user
// @access  Private
const postRateUser = asyncHandler(async (req, res) => {
  const { targetUserId, rating } = req.body;

  try {
    console.log("rate user");

    const userRecord = await Record.findOne({ userId: req.user._id });
    if (!userRecord) {
      return res.status(404).json({ msg: "User record not found" });
    }

    const targetUserRecord = await Record.findOne({ userId: targetUserId });
    if (!targetUserRecord) {
      return res.status(404).json({ msg: "Target user record not found" });
    }

    const existingRatingIndex = userRecord.ratedUser.findIndex((r) =>
      r.targetUserId.equals(targetUserId)
    );
    if (existingRatingIndex !== -1) {
      userRecord.ratedUser[existingRatingIndex].rating = rating;
    } else {
      userRecord.ratedUser.push({ targetUserId, rating });
    }

    const existingMyRatingIndex = targetUserRecord.myRating.findIndex((r) =>
      r.userId.equals(req.user._id)
    );
    if (existingMyRatingIndex !== -1) {
      targetUserRecord.myRating[existingMyRatingIndex].rating = rating;
    } else {
      targetUserRecord.myRating.push({ userId: req.user._id, rating });
    }

    await userRecord.save();
    await targetUserRecord.save();

    res.status(200).json({
      msg: "User rated successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      msg: "Failed to rate user",
    });
  }
});

export {
  getUserRecord,
  postUserRecord,
  get6RandomRecords,
  getAllRecords,
  postRateUser,
};
