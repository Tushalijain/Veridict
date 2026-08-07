const express = require("express");
const router = express.Router();
const { getCodeReview } = require("../controllers/aiReviewController");
const authMiddleware = require("../middleware/authMiddleware");
router.post("/", authMiddleware, getCodeReview);
module.exports = router;