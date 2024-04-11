import User from "../models/userModel.js";
import { errorHandler } from "./error.js";
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) return next(errorHandler(401, "Unauthorized"));

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(errorHandler(403, "Forbidden"));

    req.user = user;
    next();
  });
};

export const verifyAdmin = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) return next(errorHandler(401, "Unauthorized"));

  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) return next(errorHandler(403, "Forbidden"));

    req.user = user;
    const Profile = await User.findById(user.id);
    if (Profile.role === "admin") {
      next();
    } else {
      return next(errorHandler(401, "You are not an admin."));
    }
  });
};
