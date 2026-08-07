const mongoose = require("mongoose");
const ContestSubmission = require("../models/ContestSubmission");

const getContestLeaderboard = async (req, res) => {
  try {
    const { contestId } = req.params;

    const leaderboard = await ContestSubmission.aggregate([
      {
        $match: {
          contest: new mongoose.Types.ObjectId(contestId),
          verdict: "Accepted",
        },
      },
      {
        $group: {
          _id: "$user",
          solved: {
            $sum: 1,
          },
          points: {
            $sum: "$points",
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          _id: 0,
          userId: "$user._id",
          name: "$user.name",
          email: "$user.email",
          solved: 1,
          points: 1,
        },
      },
      {
        $sort: {
          points: -1,
          solved: -1,
        },
      },
    ]);

    console.log("Leaderboard:", leaderboard);

    res.status(200).json(leaderboard);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  getContestLeaderboard,
};