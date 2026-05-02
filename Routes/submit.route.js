
const express = require('express');
const userMiddleware = require('../middleware/userMiddleware');
const submitCode = require('../controller/userSubmission.controller')
const submitRoute = express.Router();


submitRoute.post('/submit/:id' , userMiddleware , submitCode)