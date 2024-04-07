import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { User } from "../models/dbModel.js";

const protect = asyncHandler(async (req, res, next) => {
  let token;

  token = req.cookies.jwt;
  if (token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.userId).select("-password");

    next();
  } else {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

const checkAdmin = asyncHandler(async (req, res, next) => {
  const { _id, role } = req.user;
  try {
    if (role === "admin") {
      console.log("is admin");
      next();
    } else {
      console.log("not admin");
      res.status(401).json({ msg: "Unauthorized" });
    }
  } catch (err) {
    console.log(err);
  }
});

export { protect, checkAdmin };
