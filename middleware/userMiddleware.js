/** @format */

const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../model/user.model");
const redisClient = require("../config/redis");

const userMiddleware = async (req, res, next) => {
  try {
    // sb se pehle token ko nikla pde ga
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ succ: false, mess: "Invalid Token" });
    }

    const paylod = jwt.verify(token, process.env.JWT_KEY);

    if (!paylod) {
      return res.status(401).json({ succ: false, mess: "first go to login" });
    }

    const { _id } = paylod;

    if (!_id) {
      return res.status(401).json({ succ: false, mess: "Id is missing" });
    }

    const result = await User.findById(_id);

    if (!result) {
      return res
        .status(401)
        .json({ succ: false, mess: "user does not exiest" });
    }

    // mere ko check krna h ki token Redis ke Blocklist me present to nhi h
    // auger blacklist me mila to aage nhi jane denge user ko
    const IsBlock = await redisClient.exists(`token:${token}`);
    if (IsBlock) {
      return res.status(401).json({ succ: false, mess: "Invalid Token" });
    }

    req.result = result;

    next();
  } catch (error) {
    return res.status(500).json({ succ: flase, mess: error.message });
  }
};

// export this middlware
module.exports = userMiddleware;
