const express = require('express')
const route = express.Router();

const {register , login , logout} = require('../controller/user.controller')

const userMiddleware  = require('../middleware/userMiddleware')

// user Register
route.post('/register' , register);

// login
route.post('/login' , login);

// logout
route.post('/logout',userMiddleware , logout);

// get profile
// route.get('/getprofile' , getprofile);

// export the route
module.exports = route;