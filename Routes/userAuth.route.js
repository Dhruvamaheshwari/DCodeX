/** @format */

const express = require("express");
const route = express.Router();

const {
  register,
  login,
  logout,
  adminRegister,
  deleteProfile,
  getUserProfile,
  updateUserProfile,
} = require("../controller/user.controller");

const userMiddleware = require("../middleware/userMiddleware");
const adminMiddlware = require("../middleware/adminMiddleware");

// admin Register
route.post("/admin/register", adminMiddlware, adminRegister);

// user Register
route.post("/register", register);

// login
route.post("/login", login);

// logout
route.post("/logout", userMiddleware, logout);

// delete the profile
route.delete("/profile", userMiddleware, deleteProfile);

// get profile detail and stats
route.get("/user_profile", userMiddleware, getUserProfile);

// update profile details
route.put("/update_profile", userMiddleware, updateUserProfile);

// check user is authenticated or not
route.get("/check", userMiddleware, (req, res) => {
  const reply = {
    firstName: req.result.firstName,
    emailId: req.result.emailId,
    _id: req.result._id,
    role: req.result.role,
  };

  res
    .status(200)
    .json({ succ: true, mess: "user is authenticated", user: reply });
});

// export the route
module.exports = route;
