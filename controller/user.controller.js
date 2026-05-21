/** @format */

const redisClient = require("../config/redis.js");
const User = require("../model/user.model");
const submission = require("../model/submission.model.js");
const validate = require("../utils/validator.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// register
const register = async (req, res) => {
  try {
    // check all data is correct or not using the zod validator
    validate(req.body);

    const { firstName, lastName, emailId, password } = req.body;

    // first checkt that all field are filled or not
    if (!firstName || !lastName || !emailId || !password) {
      return res
        .status(401)
        .json({ succ: false, mess: "all Field are required" });
    }

    // check ki this email id is not exist in my Database
    const isEmailPrest = await User.findOne({ emailId });
    // OR  // const isEmailPresnt = await User.exists({emailId})
    if (isEmailPrest) {
      return res
        .status(402)
        .json({ succ: false, mess: "this email allready exiest" });
    }

    // hash password
    const hashPassword = await bcrypt.hash(password, 10);

    // user create
    const user = await User.create({
      firstName,
      lastName,
      emailId,
      password: hashPassword,
    });

    // create the token
    const token = jwt.sign(
      { emailId: emailId, role: "user", _id: user._id },
      process.env.JWT_KEY,
      { expiresIn: 60 * 60 },
    );

    // iss token ko cookies me set krlo
    res.cookie("token", token, { maxAge: 60 * 60 * 1000 });

    const reply = {
      firstName: user.firstName,
      emailId: user.emailId,
      _id: user._id,
      role: user.role,
    };

    return res
      .status(200)
      .json({ succ: true, user: reply, mess: "user created successfully" });
  } catch (error) {
    return res.status(400).json({ succ: false, mess: error.message });
  }
};

// login
const login = async (req, res) => {
  try {
    // login via a email and pass
    const { emailId, password } = req.body;

    // check all field are valid or not
    if (!emailId || !password) {
      return res.status(401).json({ succ: true, mess: "Invalid Credentials" });
    }

    // to check that email and password are present in the database or not
    const userPresent = await User.findOne({ emailId });

    if (!userPresent) {
      return res.status(401).json({ succ: false, mess: "Please login first" });
    }

    // check password correct or not
    const passwordIsMatch = bcrypt.compare(password, userPresent.password);

    if (!passwordIsMatch) {
      return res.status(401).json({ succ: false, mess: "Invalid Credentials" });
    }

    // jwt token ko create kr ke return krva sakte h

    // create the token
    const token = jwt.sign(
      { emailId: emailId, _id: userPresent._id, role: userPresent.role },
      process.env.JWT_KEY,
      { expiresIn: 60 * 60 },
    );

    // iss token ko cookies me set krlo
    res.cookie("token", token, { maxAge: 60 * 60 * 1000 });

    const reply = {
      firstName: userPresent.firstName,
      emailId: userPresent.emailId,
      _id: userPresent._id,
      role: userPresent.role,
    };

    return res
      .status(200)
      .json({ succ: true, user: reply, mess: "loggin successfully" });
  } catch (error) {
    return res.status(401).json({ succ: false, mess: error.message });
  }
};

// logout => in logout i am using the redis
const logout = async (req, res) => {
  try {
    //validate the token {ham ne iska middlware bana diya h to isko route me implement kr denge}

    // Token ko add kr dunga Redis ke blacklist me
    const { token } = req.cookies;

    const payload = jwt.decode(token);

    // add krna hora redis ke ander take user logout kre to blacklist me add ho jaye

    // Add token to Redis blacklist
    await redisClient.set(`token:${token}`, "Blocked");
    await redisClient.expireAt(`token:${token}`, payload.exp);

    // cookis ko clear kr de ...
    res.cookie("token", null, { expires: new Date(Date.now()) });
    return res.status(200).json({ succ: true, mess: "Logout successfull" });
  } catch (error) {
    return res.status(500).json({ succ: false, mess: error.message });
  }
};

// getprofile

// Admin register
const adminRegister = async (req, res) => {
  try {
    // check all data is correct or not using the zod validator
    validate(req.body);

    const { firstName, lastName, emailId, password, role } = req.body;

    // first checkt that all field are filled or not
    if (!firstName || !lastName || !emailId || !password) {
      return res
        .status(401)
        .json({ succ: false, mess: "all Field are required" });
    }

    // check ki this email id is not exist in my Database
    const isEmailPrest = await User.findOne({ emailId });
    // OR  // const isEmailPresnt = await User.exists({emailId})
    if (isEmailPrest) {
      return res
        .status(402)
        .json({ succ: false, mess: "this email allready exiest" });
    }

    // hash password
    const hashPassword = await bcrypt.hash(password, 10);

    // user create
    const user = await User.create({
      firstName,
      lastName,
      emailId,
      password: hashPassword,
      role,
    });

    // create the token
    const token = jwt.sign(
      { emailId: emailId, role: user.role, _id: user._id },
      process.env.JWT_KEY,
      { expiresIn: 60 * 60 },
    );

    // iss token ko cookies me set krlo
    res.cookie("token", token, { maxAge: 60 * 60 * 1000 });

    return res
      .status(200)
      .json({ succ: true, mess: "user created successfully" });
  } catch (error) {
    return res.status(400).json({ succ: false, mess: error.message });
  }
};

// delete Profile
const deleteProfile = async (req, res) => {
  try {
    const userId = req.result._id;

    if (!userId) {
      return res.status(404).json({ succ: false, mess: "Id Not Found" });
    }

    // iss se to user ki profile delete ho gai
    await User.findByIdAndDelete(userId);

    // aab hame uss user ke sare submission bhi delete kre pde ge
    await submission.deleteMany({ userId });

    return res.status(200).json({ succ: ture, mess: "deleted successfully" });
  } catch (error) {
    return res.status(400).json({ succ: false, mess: error.message });
  }
};

// export all the controller
// get user profile details
const getUserProfile = async (req, res) => {
  try {
    const userId = req.result._id;
    const user = await User.findById(userId).populate("probleSolved");

    if (!user) {
      return res.status(404).json({ succ: false, mess: "User not found" });
    }

    // Get submission stats (only accepted)
    const submissions = await submission
      .find({ userId, status: "accepted" })
      .populate("problemId");

    // Calculate difficulty counts
    let easy = 0,
      medium = 0,
      hard = 0;

    const uniqueSolvedIds = new Set();
    const solvedProblemsDetails = [];

    submissions.forEach((sub) => {
      if (sub.problemId && !uniqueSolvedIds.has(sub.problemId._id.toString())) {
        uniqueSolvedIds.add(sub.problemId._id.toString());
        solvedProblemsDetails.push({
          _id: sub.problemId._id,
          title: sub.problemId.title,
          difficulty: sub.problemId.difficulty,
          language: sub.language,
          date: sub.createdAt || new Date(),
        });

        if (sub.problemId.difficulty === "easy") easy++;
        else if (sub.problemId.difficulty === "medium") medium++;
        else if (sub.problemId.difficulty === "hard") hard++;
      }
    });

    // Heatmap Data Calculation
    const heatmapDataObj = {};

    submissions.forEach((sub) => {
      if (sub.createdAt) {
        // Fallback checks to ensure it's a valid Date object
        const dateObj = new Date(sub.createdAt);
        if (!isNaN(dateObj)) {
          const dateStr = dateObj.toISOString().split("T")[0]; // toISOString meam -> Date ko standard format me convert karta h.
          heatmapDataObj[dateStr] = (heatmapDataObj[dateStr] || 0) + 1; // iss line me heat map me store kr rhe h ki kitne problem solve kiye iss date pe
        }
      }
    });

    const heatmapData = Object.keys(heatmapDataObj).map((date) => ({
      date: date,
      count: heatmapDataObj[date],
    }));

    // simple streak logic
    const sortedDates = Object.keys(heatmapDataObj).sort(
      (a, b) => new Date(b) - new Date(a),
    );
    let currentStreak = 0;
    let maxStreak = 0;

    if (sortedDates.length > 0) {
      let tempStreak = 1;
      let tempMaxStreak = 1;
      for (let i = 1; i < sortedDates.length; i++) {
        const prev = new Date(sortedDates[i - 1]);
        const curr = new Date(sortedDates[i]);
        const diffTime = Math.abs(prev - curr);
        // add timezone offset safety buffer by rounding
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          tempStreak++;
          if (tempStreak > tempMaxStreak) tempMaxStreak = tempStreak;
        } else if (diffDays > 1) {
          tempStreak = 1;
        }
      }

      const today = new Date().toISOString().split("T")[0];
      const diffWithToday = Math.round(
        Math.abs(new Date(today) - new Date(sortedDates[0])) /
          (1000 * 60 * 60 * 24),
      );

      if (diffWithToday <= 1) {
        currentStreak = tempStreak;
      } else {
        currentStreak = 0;
      }
      maxStreak = tempMaxStreak;
    }

    const reply = {
      firstName: user.firstName,
      lastName: user.lastName,
      emailId: user.emailId,
      role: user.role,
      totalSolved: uniqueSolvedIds.size,
      difficultyCounts: { easy, medium, hard },
      currentStreak,
      maxStreak,
      solvedProblems: solvedProblemsDetails.sort((a, b) => b.date - a.date),
      heatmapData,
    };

    return res.status(200).json({ succ: true, profile: reply });
  } catch (error) {
    return res.status(500).json({ succ: false, mess: error.message });
  }
};

// update user settings
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.result._id;
    const { firstName, lastName, password } = req.body;

    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;

    if (password) {
      const hashPassword = await bcrypt.hash(password, 10);
      updateData.password = hashPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    return res.status(200).json({
      succ: true,
      mess: "Profile updated successfully!",
      user: {
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        emailId: updatedUser.emailId,
      },
    });
  } catch (error) {
    return res.status(500).json({ succ: false, mess: error.message });
  }
};

module.exports = {
  register,
  login,
  logout,
  adminRegister,
  deleteProfile,
  getUserProfile,
  updateUserProfile,
};
