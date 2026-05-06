
const express = require('express');
const userMiddleware = require('../middleware/userMiddleware');
const SubmitCodeRareLimiter = require('../middleware/CoolDownMiddleware')
const {submitCode , RunCode} = require('../controller/userSubmission.controller')

const submitRoute = express.Router();


submitRoute.post('/submit/:id' , userMiddleware,SubmitCodeRareLimiter , submitCode)
submitRoute.post('/run/:id' , userMiddleware,SubmitCodeRareLimiter , RunCode)

// export the submitRoute
module.exports = submitRoute