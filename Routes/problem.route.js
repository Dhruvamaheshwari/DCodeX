
const express = require('express');
const problem = require('../model/problem.model');
const ProblemRoute = express.Router();

const adminMiddlware = require('../middleware/adminMiddleware')
const userMiddleware = require('../middleware/userMiddleware')
const {createProblem , updateProblem , deleteProblem , getProblemById , getAllProblem , solvedAllProblemByUser} = require('../controller/problem.controller')
// this is the rotue

// Create 
ProblemRoute.post('/create',adminMiddlware,createProblem); // ye admin kre ga

// update
ProblemRoute.put('/update/:id',adminMiddlware,updateProblem); // ye bhi admin kare ga

// delete
ProblemRoute.delete('/delete/:id',adminMiddlware,deleteProblem) // ye bhi admin kare ga

// fetch
ProblemRoute.get('/problemById/:id',userMiddleware, getProblemById)
ProblemRoute.get('/getAllProblem/',userMiddleware, getAllProblem);

// kis user ne kitni problem solve ki h
ProblemRoute.get('/problemSolvedByuser',userMiddleware,solvedAllProblemByUser) 

// export the ProblmeRouet
module.exports = ProblemRoute 