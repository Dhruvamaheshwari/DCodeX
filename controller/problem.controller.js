/** @format */

const { getPistonLanguage, executeInPiston } = require("../utils/ProblemUtility");
const problem = require("../model/problem.model.js");

// Helper: Run all test cases (visible + hidden) for a given completeCode
const validateReferenceSolution = async (completeCode, language, visibleTestCases, hiddenTestCases) => {
  const allTestCases = [...visibleTestCases, ...hiddenTestCases];
  for (let i = 0; i < allTestCases.length; i++) {
    const testCase = allTestCases[i];
    const result = await executeInPiston(completeCode, language, testCase.input);

    // Any error (compilation, runtime, missing language) -> fail
    if (result.error) {
      return {
        passed: false,
        message: `Test case ${i + 1} (input: ${testCase.input}) failed with error: ${result.message || result.stderr}`,
        details: result,
      };
    }

    const output = (result.stdout || "").trim();
    const expected = (testCase.output || "").trim();

    if (output !== expected) {
      return {
        passed: false,
        message: `Test case ${i + 1} (input: ${testCase.input}) output mismatch. Expected: "${expected}", Got: "${output}"`,
        details: { expected, got: output },
      };
    }
  }
  return { passed: true };
};

// ================= CREATE PROBLEM =================
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
  } = req.body;

  // Basic validation
  if (!referenceSolution || referenceSolution.length === 0) {
    return res.status(400).json({ message: "At least one reference solution required" });
  }

  try {
    // Validate each reference solution against ALL test cases (visible + hidden)
    for (const sol of referenceSolution) {
      const { completeCode } = sol;
      const lang = sol.language_id || sol.language;
      const parsedLanguage = getPistonLanguage(lang);

      if (!parsedLanguage) {
        return res.status(400).json({ message: `Language ${lang} not supported` });
      }

      if (!completeCode || completeCode.trim() === "") {
        return res.status(400).json({ message: "completeCode is missing or empty in referenceSolution" });
      }

      // Run validation
      const validation = await validateReferenceSolution(
        completeCode,
        parsedLanguage,
        visibleTestCases || [],
        hiddenTestCases || []
      );

      if (!validation.passed) {
        return res.status(400).json({
          message: `Reference solution for ${parsedLanguage} failed validation.`,
          reason: validation.message,
        });
      }
    }

    // All reference solutions passed – save problem
    const userProblem = await problem.create({
      ...req.body,
      problemCreator: req.result._id,
    });

    return res.status(200).json({ message: "Problem Saved Successfully", problemId: userProblem._id });
  } catch (error) {
    console.error("Create problem error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// ================= UPDATE PROBLEM =================
const updateProblem = async (req, res) => {
  const { id } = req.params;
  const { visibleTestCases, hiddenTestCases, referenceSolution } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Missing problem ID" });
  }

  try {
    const existingProblem = await problem.findById(id);
    if (!existingProblem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    // If new referenceSolution provided, validate it against test cases
    if (referenceSolution && referenceSolution.length > 0) {
      const visible = visibleTestCases || existingProblem.visibleTestCases;
      const hidden = hiddenTestCases || existingProblem.hiddenTestCases;

      for (const sol of referenceSolution) {
        const { completeCode } = sol;
        const lang = sol.language_id || sol.language;
        const parsedLanguage = getPistonLanguage(lang);

        if (!parsedLanguage) {
          return res.status(400).json({ message: `Language ${lang} not supported` });
        }

        if (!completeCode || completeCode.trim() === "") {
          return res.status(400).json({ message: "completeCode missing in referenceSolution" });
        }

        const validation = await validateReferenceSolution(completeCode, parsedLanguage, visible, hidden);
        if (!validation.passed) {
          return res.status(400).json({
            message: `Reference solution for ${parsedLanguage} failed validation.`,
            reason: validation.message,
          });
        }
      }
    }

    const updatedProblem = await problem.findByIdAndUpdate(
      id,
      { ...req.body },
      { runValidators: true, new: true }
    );

    return res.status(200).json({ success: true, problem: updatedProblem });
  } catch (error) {
    console.error("Update problem error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// ================= Delete =================
const deleteProblem = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await problem.findByIdAndDelete(id);
    if (!data) return res.status(404).json({ message: "Problem not found" });
    return res.status(200).json({ success: true, deletedProblem: data });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ================= Get Problem by Id =================
const getProblemById = async (req, res) => {
  try {
    // (select) ki help se hum only vahi data send kr sakte h frontend pr jo hame show krna h naki pura data;
    const data = await problem.findById(req.params.id).select('_id title description difficulty tags visibleTestCases startCode referenceSolution');
    if (!data) return res.status(404).json({ message: "Problem not found" });
    return res.status(200).json({ success: true, problem: data });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// ================= Get All PROBLEM =================
const getAllProblem = async (req, res) => {
  try {
    const data = await problem.find({}).select('_id title tags difficulty');
    return res.status(200).json({ success: true, problems: data });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProblem,
  updateProblem,   // Fixed typo: was "updareProblem"
  deleteProblem,
  getProblemById,
  getAllProblem,
};