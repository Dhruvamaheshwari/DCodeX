
const express = require('express');
const userMiddleware = require('../middleware/userMiddleware');
const {submitCode , RunCode} = require('../controller/userSubmission.controller')

const submitRoute = express.Router();


submitRoute.post('/submit/:id' , userMiddleware , submitCode)
submitRoute.post('/run/:id' , userMiddleware , RunCode)

// export the submitRoute
module.exports = submitRoute