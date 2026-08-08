const express = require("express");
const router = express.Router();

const {
  createSubmission,
  getSubmissions,
} = require("../controllers/submissionController");

const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, getSubmissions);

router.post("/", authMiddleware, createSubmission);

module.exports = router;