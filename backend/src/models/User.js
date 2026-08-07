const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // ===== STREAK SYSTEM =====

    currentStreak: {
      type: Number,
      default: 0,
    },

    longestStreak: {
      type: Number,
      default: 0,
    },

    lastSolvedDate: {
      type: Date,
      default: null,
    },

    totalSolved: {
      type: Number,
      default: 0,
    },
    solvedProblems: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Problem"
    }
    
],
badges: [
    {
        type: String
    }
],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;