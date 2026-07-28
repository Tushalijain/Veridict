const express = require("express");

const router = express.Router();

const {
  getCodeReview,
} = require("../controllers/aiReviewController");

router.post("/", getCodeReview);

module.exports = router;