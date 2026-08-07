const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const problemRoutes = require("./routes/problemRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const testCaseRoutes = require("./routes/testCaseRoutes");
const executeRoutes = require("./routes/executeRoutes");
const compilerRoutes = require("./routes/compilerRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");
const aiReviewRoutes = require("./routes/aiReviewRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const contestLeaderboardRoutes = require("./routes/contestLeaderboardRoutes");
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL,
      "http://localhost:5173",
    ],
    credentials: true,
  })
);
app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/testcases", testCaseRoutes);
app.use("/api/execute", executeRoutes);
app.use("/api/compiler", compilerRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/review", aiReviewRoutes);
app.use("/api/profile", require("./routes/profileRoutes"));
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/contests", require("./routes/contestRoutes"));
app.use("/api/contest-leaderboard", contestLeaderboardRoutes);
module.exports = app;