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

    // console.log(record);

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

  // console.log(req.body);
  try {
    // Check if a record with the given userId already exists
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
    const allRecords = await Record.find();

    // Function to shuffle an array
    const shuffleArray = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };

    // Shuffle the allRecords array
    const shuffledRecords = shuffleArray(allRecords);

    // Select the first 6 records
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
    const allRecords = await Record.find();

    // let filteredRecordsCount = 0;
    const filteredRecords = allRecords.filter((record) => {
      const userid = req.user?._id?.toString();
      const compid = record.userId?.toString();

      if (userid && compid) {
        // console.log(`current userid: ${userid}, compere id: ${compid}`);
        if (userid === compid) {
          // filteredRecordsCount++;
          return false;
        }
      }
      return true;
    });

    // console.log(filteredRecordsCount);
    // const userNames = filteredRecords.map((record) => record.userName);
    // console.log(filteredRecords);

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

export { getUserRecord, postUserRecord, get6RandomRecords, getAllRecords };
