const express = require("express");
const router = express.Router();
const {
  createContest,
  getContests,
   registerContest,getContestById
} = require("../controllers/contestController");

router.post("/", createContest);
router.get("/", getContests);
router.post("/register", registerContest);
router.get("/:id", getContestById);
module.exports = router;