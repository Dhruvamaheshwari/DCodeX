const express = require('express')
const route = express.Router();

// user Register
route.post('/register' , register);

// login
route.post('/login' , login);

// logout
route.post('/logout' , logout);

// get profile
route.get('/getprofile' , getprofile);