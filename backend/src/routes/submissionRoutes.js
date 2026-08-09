const express = require("express");
const router = express.Router();

const {
    createSubmission,
    getSubmissions,
    getUserSubmissions,
} = require("../controllers/submissionController");

const authMiddleware = require("../middleware/authMiddleware");

router.get("/", getSubmissions);

router.get("/user", authMiddleware, getUserSubmissions);

router.post("/", authMiddleware, createSubmission);

module.exports = router;