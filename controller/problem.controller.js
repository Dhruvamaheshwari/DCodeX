/** @format */

const { getJDoodleLanguageInfo, executeInJDoodle } = require("../utils/ProblemUtility");

const problem = require("../model/problem.model.js");


// this is create the problem
const createProblem = async (req, res) => {
  const {
    title,
    description,
    difficulty,
    tags,
    visibleTestCases,
    hiddenTestCases,
    startCode,
    referenceSolution,
    problemCreator,
  } = req.body;

  try {
    for (const { language, completeCode } of referenceSolution) {
      const languageInfo = getJDoodleLanguageInfo(language);

      if (!languageInfo) {
        return res.status(400).send(`Language ${language} not supported`);
      }

      for (const testCase of visibleTestCases) {
        const result = await executeInJDoodle(
          completeCode,
          languageInfo.language,
          languageInfo.versionIndex,
          testCase.input,
        );

        // JDoodle returns output and statusCode (status 200 means execution was successful, memory/cpu time, etc.)
        // JDoodle output might have a trailing newline, so we trim to compare
        if (
          !result ||
          !result.output ||
          result.output.trim() !== testCase.output.trim()
        ) {
          return res.status(400).send({
            message: "Test case failed",
            expected: testCase.output,
            actual: result ? result.output : "No output",
          });
        }
      }
    }

    // auger ye main for loop complete ho gya to uska mtlb h ki user ne jo beja h vo eek dum teeh h
    // to aab hum iss data to database ke ander store kara sakte h;
    const userPorble = await problem.create({
      ...req.body,
      problemCreator: req.result._id,
    }); // ye req.result._id admin middleware se aai h naki judge0 bale reskult h ok

    return res.status(200).send("Problem Saved Successfully");
  } catch (error) {
    return res.status(500).json({ succ: false, mess: error.message });
  }
};


// this is update the problem
const updareProblem = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    difficulty,
    tags,
    visibleTestCases,
    hiddenTestCases,
    startCode,
    referenceSolution,
    problemCreator,
  } = req.body;
  try {
    // check id aai h ki nhi
    if (!id) {
      return res.status(402).json({ succ: false, mess: "Missing ID Field" });
    }

    // check that id is present in the database or not
    const isIdPresent = await problem.findById(id);
    if (!isIdPresent) {
      return res
        .status(402)
        .json({ succ: false, mess: "this Id is not found" });
    }

    // check kro ki jo data frontend se aaya h vo data sahi chal rha h jese hum ne createProblem krte time kiya tha
    for (const { language, completeCode } of referenceSolution) {
      const languageInfo = getJDoodleLanguageInfo(language);

      if (!languageInfo) {
        return res.status(400).send(`Language ${language} not supported`);
      }

      for (const testCase of visibleTestCases) {
        const result = await executeInJDoodle(
          completeCode,
          languageInfo.language,
          languageInfo.versionIndex,
          testCase.input,
        );

        // JDoodle returns output and statusCode (status 200 means execution was successful, memory/cpu time, etc.)
        // JDoodle output might have a trailing newline, so we trim to compare
        if (
          !result ||
          !result.output ||
          result.output.trim() !== testCase.output.trim()
        ) {
          return res.status(400).send({
            message: "Test case failed",
            expected: testCase.output,
            actual: result ? result.output : "No output",
          });
        }
      }
    }

    // update the problem
    const updatedProblem = await problem.findByIdAndUpdate(
      id,
      { ...req.body },
      { runValidators: true, new: true },
    ); // ...req.body ka mtlb jo bhi body se aarha h vo s update kro
    return res.status(200).json({ succ: true, mess: updatedProblem });
  } catch (error) {
    return res.status(500).json({ succ: false, mess: error.message });
  }
};


// this is delete the problem
const deleteProblem = async (req, res) => {
  const { id } = req.params;

  try {
    // check id aai h ki nhi
    if (!id) {
      return res.status(402).json({ succ: false, mess: "Missing ID Field" });
    }

    // check that id is present in the database or not
    const isIdPresent = await problem.findById(id);
    if (!isIdPresent) {
      return res.status(402).json({ succ: false, mess: "this Id is not found" });
    }

    const deletedProblme = await problem.findByIdAndDelete(id, { new: true })
    return res.status(200).json({ succ: true, mess: deletedProblme })
  } catch (error) {
    return res.status(500).json({ succ: false, mess: error.message });
  }
};


// this is get Problem By Id
const getProblemById = async (req, res) => {
  const { id } = req.params;

  try {
    // check id aai h ki nhi
    if (!id) {
      return res.status(402).json({ succ: false, mess: "Missing ID Field" });
    }

    // check that id is present in the database or not
    const isIdPresent = await problem.findById(id);
    if (!isIdPresent) {
      return res.status(402).json({ succ: false, mess: "this Id is not found" });
    }

    // get all the problem
    const allProblem = await problem.findById(id);
    return res.status(200).json({succ:true , mess:allProblem});

  } catch (error) {
    return res.status(500).json({ succ: false, mess: error.message });
  }
};


// this is get All Problem
const getAllProblem = async (req, res) => {

  try {

    // in this we appley "pageing"
    const {page} = req.body
    const limit = 10;
    const skip = (page - 1) * limit;
    
    // get all the problem
    const allProblem = await problem.find({}).skip(skip).limit(limit);

    // to check problem present or not
    if(allProblem.length == 0)
    {
      return res.status(404).json({succ:false , mess:"Problems are not present"})
    }

    return res.status(200).json({succ:true , mess:allProblem});

  } catch (error) {
    return res.status(500).json({ succ: false, mess: error.message });
  }
};


// this is solved All Problem By User
const solvedAllProblemByUser = async (req , res) => {

}
// export the createProblem
module.exports = { createProblem, updareProblem, deleteProblem, getProblemById, getAllProblem, solvedAllProblemByUser };
