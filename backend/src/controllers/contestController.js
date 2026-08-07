const Contest = require("../models/Contest");

const createContest = async (req, res) => {
  try {
    const contest = await Contest.create(req.body);

    res.status(201).json({
      success: true,
      contest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getContests = async (req, res) => {
  try {
    const contests = await Contest.find()
      .populate("problems", "title difficulty")
      .populate("registeredUsers", "_id")
      .sort({ startTime: 1 });

      const now = new Date();

    contests.forEach((contest) => {
      if (now < contest.startTime) {
        contest.status = "Upcoming";
      } else if (now >= contest.startTime && now <= contest.endTime) {
        contest.status = "Running";
      } else {
        contest.status = "Ended";
      }
    });

    res.json({
      success: true,
      contests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getContest = async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id)
      .populate("problems");

    res.json({
      success: true,
      contest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const registerContest = async (req, res) => {
  try {
    const { contestId, userId } = req.body;

    const contest = await Contest.findById(contestId);

    if (!contest) {
      return res.status(404).json({
        success: false,
        message: "Contest not found",
      });
    }

    if (contest.registeredUsers.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: "Already registered",
      });
    }

    contest.registeredUsers.push(userId);
    const User = require("../models/User");

const user = await User.findById(userId);

if (
    user &&
    !user.badges.includes("Contest Participant")
) {
    user.badges.push("Contest Participant");
    await user.save();
}

    await contest.save();

    res.json({
      success: true,
      message: "Contest Registered Successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

const getContestById = async (req, res) => {
  try {

    const contest = await Contest.findById(req.params.id).populate(
  "problems"
);

const now = new Date();

if (now < contest.startTime) {
    contest.status = "Upcoming";
} else if (now > contest.endTime) {
    contest.status = "Ended";
} else {
    contest.status = "Running";
}
await contest.save();
    res.json({
      success: true,
      contest,
    });

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }
};

module.exports = {
  createContest,
  getContests,
  getContest,
  registerContest,getContestById,
};