const express = require('express')
const app = express();
require('dotenv').config()
Port = process.env.PORT || 4000;

// import the cooki
const cookieParser = require('cookie-parser')

// middleware
app.use(express.json());
app.use(cookieParser());

const dbconnect = require('./config/db.connect')

dbconnect()
.then(async () => {
    app.listen(Port  , () => console.log(`server is started at port ${Port}`));
})
.catch(err => console.log(err.message));

