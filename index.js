/** @format */

const express = require("express");
const app = express();
require("dotenv").config();
const Port = process.env.PORT || 4000;

const route = require("./Routes/userAuth.route");
const ProblemRoute = require("./Routes/problem.route");
const submitRoute = require("./Routes/submit.route");

// import the cookie
const cookieParser = require("cookie-parser");
const cors = require("cors");

// middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Vite default port
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use("/user", route);
app.use("/problem", ProblemRoute);
app.use("/submission", submitRoute);

const dbconnect = require("./config/db.connect");
const redisClient = require("./config/redis");

const InitializeConnection = async () => {
  try {
    await Promise.all([dbconnect(), redisClient.connect()]);
    console.log("DB Connected");

    app.listen(Port, () => console.log(`server is started at port ${Port}`));
  } catch (error) {
    console.log(error);
  }
};

InitializeConnection();

// dbconnect()
// .then(async () => {
//     app.listen(Port  , () => console.log(`server is started at port ${Port}`));
// })
// .catch(err => console.log(err.message));
