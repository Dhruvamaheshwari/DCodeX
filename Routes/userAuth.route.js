const express = require('express')
const route = express.Router();

const {register , login , logout , adminRegister} = require('../controller/user.controller')

const userMiddleware  = require('../middleware/userMiddleware')
const adminMiddlware = require('../middleware/adminMiddleware')

// admin Register
route.post('/admin/register' , adminMiddlware , adminRegister)

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