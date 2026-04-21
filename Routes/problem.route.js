
const express = require('express');
const problem = require('../model/problem.model');
const ProblemRoute = express.Router();

const adminMiddlware = require('../middleware/adminMiddleware')
const createProblem = require('../controller/problem.controller')
// this is the rotue

// Create 
ProblemRoute.post('/create',adminMiddlware,createProblem); // ye admin kre ga

// // update
// ProblemRoute.put('/:id',updareProblem); // ye bhi admin kare ga

// // delete
// ProblemRoute.delete('/:id',deleteProblem) // ye bhi admin kare ga

// // fetch
// ProblemRoute.get('/:id', getProblemById)
// ProblemRoute.get('/', getAppProblem);

// // kis user ne kitni problem solve ki h
// ProblemRoute.get('/user',solvedAllProblemByUser) 

// export the ProblmeRouet
module.exports = ProblemRoute