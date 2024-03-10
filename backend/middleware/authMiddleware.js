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

export { protect };
