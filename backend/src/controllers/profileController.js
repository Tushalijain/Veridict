const User = require("../models/User");
const Submission = require("../models/Submission");

const getProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const submissions = await Submission.find({ user: userId });

    const totalSubmissions = submissions.length;

    const accepted = submissions.filter(
      (s) => s.verdict === "Accepted"
    ).length;

    const wrongAnswer = submissions.filter(
      (s) => s.verdict === "Wrong Answer"
    ).length;

    const compilationError = submissions.filter(
      (s) => s.verdict === "Compilation Error"
    ).length;

    const runtimeError = submissions.filter(
      (s) => s.verdict === "Runtime Error"
    ).length;

    const timeLimitExceeded = submissions.filter(
      (s) => s.verdict === "Time Limit Exceeded"
    ).length;

    // Count unique solved problems
    const solvedProblems = new Set();

    submissions.forEach((submission) => {
      if (submission.verdict === "Accepted") {
        solvedProblems.add(submission.problem.toString());
      }
    });

    const acceptanceRate =
      totalSubmissions === 0
        ? 0
        : ((accepted / totalSubmissions) * 100).toFixed(2);

    res.json({
      success: true,
      user,
      stats: {
        solved: solvedProblems.size,
        totalSubmissions,
        accepted,
        wrongAnswer,
        compilationError,
        runtimeError,
        timeLimitExceeded,
        acceptanceRate,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getProfile,
};