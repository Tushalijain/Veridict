const express = require("express");
const router = express.Router();

const {
  getContestLeaderboard,
} = require("../controllers/contestLeaderboardController");

router.get("/:contestId", getContestLeaderboard);

module.exports = router;