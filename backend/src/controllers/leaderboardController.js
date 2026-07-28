const Submission = require("../models/Submission");

const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Submission.aggregate([
  {
    $match: {
      verdict: "Accepted",
    },
  },

  {
    $group: {
      _id: "$user",

      solvedProblems: {
        $addToSet: "$problem",
      },

      totalAccepted: {
        $sum: 1,
      },
    },
  },

  {
    $lookup: {
      from: "submissions",
      let: { userId: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ["$user", "$$userId"],
            },
          },
        },
        {
          $count: "count",
        },
      ],
      as: "submissionCount",
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
  $lookup: {
    from: "problems",
    localField: "solvedProblems",
    foreignField: "_id",
    as: "problemDetails",
  },
},

  {
    $unwind: "$user",
  },

  {
    $addFields: {
      solved: {
        $size: "$solvedProblems",
      },

      totalSubmissions: {
        $ifNull: [
          {
            $arrayElemAt: [
              "$submissionCount.count",
              0,
            ],
          },
          0,
        ],
      },

      points: {
  $sum: {
    $map: {
      input: "$problemDetails",
      as: "problem",
      in: {
        $switch: {
          branches: [
            {
              case: { $eq: ["$$problem.difficulty", "Easy"] },
              then: 10,
            },
            {
              case: { $eq: ["$$problem.difficulty", "Medium"] },
              then: 20,
            },
            {
              case: { $eq: ["$$problem.difficulty", "Hard"] },
              then: 30,
            },
          ],
          default: 0,
        },
      },
    },
  },
},
    },
  },

  {
    $addFields: {
      accuracy: {
        $round: [
          {
            $multiply: [
              {
                $divide: [
                  "$solved",
                  "$totalSubmissions",
                ],
              },
              100,
            ],
          },
          2,
        ],
      },
    },
  },

 {
  $sort: {
    points: -1,
    solved: -1,
    accuracy: -1,
  },
},

  {
    $limit: 10,
  },
]);

    return res.json(leaderboard);

  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  getLeaderboard,
};