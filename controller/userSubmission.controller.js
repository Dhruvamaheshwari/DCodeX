
const problem = require('../model/problem.model');
const submission = require('../model/submission.model');
const { getPistonLanguage, executeInPiston } = require('../utils/ProblemUtility');

const submitCode = async(req , res) => {
    try {
        const userId = req.result._id; // ye middleware se ninal ki userMiddleware
        const problemId = req.params.id; // ye parameter se mil jaye ga
        const {Code , language} = req.body // ye sb user beje ga to body se mil jaye ga


        // chekc all field are present or not
        if(!userId || !problemId  || !Code || !language)
        {
            return res.status(400).json({succ:false , mess:"Some field missing"})
        }

        // fetch the problem from the db
        const Problem = await problem.findById(problemId)
        if (!Problem) {
            return res.status(404).json({succ:false , mess:"Problem not found"});
        }

        // eek bar ye problem db se aagai to mreko hidden test case mil jaye ge to me run kr satke hu 
        // hum pehle use ke code ko db me store krte h fir pistoo ko send kre ge or fir db me update kre ge ki kya status h
        const submitResult = await submission.create({userId , problemId , Code , language , status:'pending' , testCasesTotal:Problem.hiddenTestCases.length})

        // pisto ko code submit krna h;
        const langForPiston = getPistonLanguage(language); // to find the lan. id
        
        let testCasePassed = 0;
        let isError = false;
        let errorMessage = '';

        for (let i = 0; i < Problem.hiddenTestCases.length; i++) {
            const testCase = Problem.hiddenTestCases[i];
            
            const executionResult = await executeInPiston(Code, langForPiston, testCase.input);

            if (executionResult.error) {
                isError = true;
                errorMessage = executionResult.message || executionResult.stderr || 'Execution Error';
                break;
            }

            const expectedOutput = testCase.output.trim();
            const actualOutput = executionResult.stdout.trim();

            if (expectedOutput === actualOutput) {
                testCasePassed++;
            } else {
                break; // Stop at first wrong answer
            }
        }

        let finalStatus = 'pending';
        if (isError) {
            finalStatus = 'error';
        } else if (testCasePassed === Problem.hiddenTestCases.length) {
            finalStatus = 'accepted';
        } else {
            finalStatus = 'wrong';
        }

        submitResult.status = finalStatus;
        submitResult.testCasePassed = testCasePassed;
        if (isError) {
            submitResult.errorMessage = errorMessage;
        }

        // submitResult  ko update karo
        await submitResult.save();

        // problem id ko insert kre ge user schema ke problemSolved me if is not present there
        if(!req.result.probleSolved.includes(problemId)){ // pehse "includes" ki help se check kiya ki problemId present h ki nhi h;
            req.result.probleSolved.push(problemId);
            await req.result.save();
        }

        return res.status(200).json({
            succ: true,
            status: finalStatus,
            testCasePassed: testCasePassed,
            testCasesTotal: Problem.hiddenTestCases.length,
            errorMessage: errorMessage,
            submissionId: submitResult._id
        }); 

    } catch (error) {
        console.error(error);
        return res.status(500).json({succ:false, mess:"Internal server error"});
    }
}

module.exports = submitCode;




/**
 * iss form me response aata h pioston ka
    {
    "language": "python",
    "version": "3.10.0",
    "run": {
        "stdout": "Hello World\n",
        "stderr": "",
        "exit_code": 0,
        "output": "Hello World\n"
    },
    "compile": {
        "stdout": "",
        "stderr": "",
        "exit_code": 0
    }
    }
*/