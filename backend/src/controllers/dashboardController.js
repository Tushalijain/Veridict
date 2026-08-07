const User = require("../models/User");
const Problem = require("../models/Problem");
const Submission = require("../models/Submission");

const getDashboardStats = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const problems = await Problem.find();

    const submissions = await Submission.find({ user: userId })
      .populate("problem");

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

    const tle = submissions.filter(
      (s) => s.verdict === "Time Limit Exceeded"
    ).length;

    const accuracy =
      submissions.length === 0
        ? 0
        : ((accepted / submissions.length) * 100).toFixed(2);

        const solvedProblemIds = new Set();

submissions.forEach((submission) => {
  if (submission.verdict === "Accepted") {
    solvedProblemIds.add(submission.problem._id.toString());
  }
});

    // Total problems
const easyTotal = problems.filter(
  (p) => p.difficulty === "Easy"
).length;

const mediumTotal = problems.filter(
  (p) => p.difficulty === "Medium"
).length;

const hardTotal = problems.filter(
  (p) => p.difficulty === "Hard"
).length;


let easySolved = 0;
let mediumSolved = 0;
let hardSolved = 0;

problems.forEach((problem) => {

  // Skip if this problem was never solved by the user
  if (!solvedProblemIds.has(problem._id.toString()))
    return;

  if (problem.difficulty === "Easy")
    easySolved++;

  else if (problem.difficulty === "Medium")
    mediumSolved++;

  else if (problem.difficulty === "Hard")
    hardSolved++;

});

    res.json({
      success: true,

      user,

      stats: {
        totalProblems: problems.length,
        totalSubmissions: submissions.length,
        accepted,
        wrongAnswer,
        compilationError,
        runtimeError,
        tle,
        accuracy,
      },

      difficulty: {
  easy: {
    solved: easySolved,
    total: easyTotal,
  },

  medium: {
    solved: mediumSolved,
    total: mediumTotal,
  },

  hard: {
    solved: hardSolved,
    total: hardTotal,
  },
},

      recentSubmissions: submissions
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, 5),
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};

module.exports = {
  getDashboardStats,
};