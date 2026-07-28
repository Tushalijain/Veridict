const User = require("../models/User");
const Problem = require("../models/Problem");
const Submission = require("../models/Submission");

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProblems = await Problem.countDocuments();
    const totalSubmissions = await Submission.countDocuments();

    const accepted = await Submission.countDocuments({
      verdict: "Accepted",
    });

    const wrongAnswer = await Submission.countDocuments({
      verdict: "Wrong Answer",
    });

    const compilationError = await Submission.countDocuments({
      verdict: "Compilation Error",
    });

    const runtimeError = await Submission.countDocuments({
      verdict: "Runtime Error",
    });

    const tle = await Submission.countDocuments({
      verdict: "Time Limit Exceeded",
    });

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalProblems,
        totalSubmissions,
        accepted,
        wrongAnswer,
        compilationError,
        runtimeError,
        tle,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = { getDashboardStats };