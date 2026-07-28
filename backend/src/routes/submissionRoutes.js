const express = require("express");

const router = express.Router();

const {
  createSubmission,
  getSubmissions,
  getUserSubmissions,
} = require("../controllers/submissionController");

router.get("/", getSubmissions);
router.get("/user/:userId", getUserSubmissions);
router.post("/", createSubmission);

module.exports = router;