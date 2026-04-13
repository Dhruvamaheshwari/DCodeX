
const express = require('express');
const problem = require('../model/problem.model');
const ProblemRoute = express.Router();

// this is the rotue

// Create 
ProblemRoute.post('/create',problemCreate); // ye admin kre ga

// update
ProblemRoute.put('/:id',problemUpdate); // ye bhi admin kare ga

// delete
ProblemRoute.delete('/:id',problemDelete) // ye bhi admin kare ga

// fetch
ProblemRoute.get('/:id', problemFetch)
ProblemRoute.get('/', FetchAllProblem);

// kis user ne kitni problem solve ki h
ProblemRoute.get('/user',solvedProblem)