const express = require("express");
const userMiddleware = require("../middleware/userMiddleware");
const { sendChatReply } = require("../controller/chat.controller");

const chatRoute = express.Router();

chatRoute.post("/ai", userMiddleware, sendChatReply);

module.exports = chatRoute;