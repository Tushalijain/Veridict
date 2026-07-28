const express = require("express");

const router = express.Router();

const {
  createContest,
  getContests,
  getContest, registerContest,getContestById
} = require("../controllers/contestController");

router.post("/", createContest);

router.get("/", getContests);

router.get("/:id", getContest);

router.post("/register", registerContest);
router.get("/:contestId", getContestById);
module.exports = router;