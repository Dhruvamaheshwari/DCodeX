/** @format */

const {
  getJDoodleLanguageInfo,
  executeInJDoodle,
} = require("../utils/ProblemUtility");
const problem = require("../model/problem.model.js");

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

// export the createProblem
module.exports = createProblem;
