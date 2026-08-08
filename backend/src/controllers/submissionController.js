const Submission = require("../models/Submission");
const Problem = require("../models/Problem");
const TestCase = require("../models/TestCase");
const User = require("../models/User");
const Contest = require("../models/Contest");
const ContestSubmission = require("../models/ContestSubmission");
const judgeService = require("../services/judgeService");

const createSubmission = async (req, res) => {
    try {
        const {userId, problemId, contestId,language, code,} = req.body;
    let contest = null;

if (contestId) {

    contest = await Contest.findById(contestId);

    if (!contest) {
        return res.status(404).json({
            success: false,
            message: "Contest not found",
        });
    }

    const now = new Date();

if (now < contest.startTime) {
    return res.status(403).json({
        success: false,
        message: "Contest has not started yet.",
    });
}

if (now >= contest.startTime && now < contest.endTime) {
    contest.status = "Running";
} else {
    contest.status = "Ended";
}

    // If contest is Running → ContestSubmission will be created later.
    // If contest is Ended → allow submission as practice.
}

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

console.log("===== TEST CASES FROM DB =====");
console.log(testCases);

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
    contest: contestId || null,
    language,
    code,
    verdict: result.verdict,
    executionTime: result.executionTime || 0
});
console.log("contestId:", contestId);
console.log("contest status:", contest?.status);
if (contestId && contest.status === "Running") {

    const existing = await ContestSubmission.findOne({
        contest: contestId,
        user: userId,
        problem: problemId,
        verdict: "Accepted",
    });

    // Save only the first Accepted submission
    if (!existing && result.verdict === "Accepted") {

        let points = 0;

        if (problemData.difficulty === "Easy")
            points = 10;

        else if (problemData.difficulty === "Medium")
            points = 20;

        else if (problemData.difficulty === "Hard")
            points = 30;

        await ContestSubmission.create({
            contest: contestId,
            user: userId,
            problem: problemId,
            verdict: result.verdict,
            points,
        });

    }

}

if (result.verdict === "Accepted") {

    const user = await User.findById(userId);

    if (user) {

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const lastSolved = user.lastSolvedDate
            ? new Date(user.lastSolvedDate)
            : null;

        if (lastSolved) {
            lastSolved.setHours(0, 0, 0, 0);
        }

        if (!lastSolved) {

            user.currentStreak = 1;

        } else {

            const diffDays =
                (today - lastSolved) / (1000 * 60 * 60 * 24);

            if (diffDays === 1) {

                user.currentStreak += 1;

            } else if (diffDays > 1) {

                user.currentStreak = 1;

            }

            // diffDays === 0 → already solved today
            // keep the same streak
        }

        user.lastSolvedDate = today;

        if (user.currentStreak > user.longestStreak) {
            user.longestStreak = user.currentStreak;
        }

        if (!user.solvedProblems.includes(problemId)) {
            user.solvedProblems.push(problemId);
            user.totalSolved += 1;
        }

        await user.save();
    }
}

// ================= STREAK SYSTEM =================

if (result.verdict === "Accepted") {

    const user = await User.findById(userId);

    if (user) {

        const today = new Date();

        // Ignore time part
        today.setHours(0, 0, 0, 0);

        if (user.lastSolvedDate) {

            const lastSolved = new Date(user.lastSolvedDate);
            lastSolved.setHours(0, 0, 0, 0);

            const diffDays = Math.floor(
                (today - lastSolved) / (1000 * 60 * 60 * 24)
            );

            if (diffDays === 0) {
                // Already solved today
            }
            else if (diffDays === 1) {
                user.currentStreak += 1;
            }
            else {
                user.currentStreak = 1;
            }

        } else {

            user.currentStreak = 1;

        }

        user.lastSolvedDate = today;

        const alreadySolved = user.solvedProblems.some(
    id => id.toString() === problemId.toString()
);

if (!alreadySolved) {

    user.solvedProblems.push(problemId);

    user.totalSolved += 1;
    // First Accepted
if (
    user.totalSolved >= 1 &&
    !user.badges.includes("First Accepted")
) {
    user.badges.push("First Accepted");
}

// 25 Problems
if (
    user.totalSolved >= 25 &&
    !user.badges.includes("Problem Solver")
) {
    user.badges.push("Problem Solver");
}

// 100 Problems
if (
    user.totalSolved >= 100 &&
    !user.badges.includes("Coding Master")
) {
    user.badges.push("Coding Master");
}

// 7 Day Streak
if (
    user.currentStreak >= 7 &&
    !user.badges.includes("7-Day Streak")
) {
    user.badges.push("7-Day Streak");
}

}

        if (user.currentStreak > user.longestStreak) {
            user.longestStreak = user.currentStreak;
        }

        await user.save();

    }

}

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
    const userId = req.user.userId;

    const submissions = await Submission.find({
      user: userId
    })
      .populate("user", "name email")
      .populate("problem", "title")
      .sort({ createdAt: -1 });

    return res.status(200).json(submissions);

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

const getUserSubmissions = async (req, res) => {
  try {
    const userId = req.user.userId;

    const submissions = await Submission.find({
      user: userId
    })
      .populate("problem", "title")
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