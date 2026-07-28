const Submission = require("../models/Submission");
const Problem = require("../models/Problem");
const TestCase = require("../models/TestCase");

const judgeService = require("../services/judgeService");

const createSubmission = async (req, res) => {
    try {
        const { userId, problemId, language, code } = req.body;

        // Check problem exists
        const problemData = await Problem.findById(problemId);

        if (!problemData) {
            return res.status(404).json({
                success: false,
                message: "Problem not found"
            });
        }

        // Get all test cases
        const testCases = await TestCase.find({ problemId });

        if (testCases.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No test cases found"
            });
        }

       
       // Judge the submission
const result = await judgeService(language, code, testCases);

console.log("Judge Result:", result);
console.log("Judge Verdict:", result.verdict);

// Save submission
const submission = await Submission.create({
    user: userId,
    problem: problemId,
    language,
    code,
    verdict: result.verdict,
    executionTime: result.executionTime || 0
});
        return res.status(201).json({
            success: true,
            submission,
            result
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

const getSubmissions = async (req, res) => {
    try {
        const submissions = await Submission.find()
            .populate("user", "name email")
            .populate("problem", "title");

        return res.status(200).json(submissions);

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

const getUserSubmissions = async (req, res) => {
  try {
    const { userId } = req.params;

    const submissions = await Submission.find({ userId })
      .populate("problemId", "title")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      submissions,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch submissions",
    });
  }
};

module.exports = {
  createSubmission,
  getSubmissions,
  getUserSubmissions,
};