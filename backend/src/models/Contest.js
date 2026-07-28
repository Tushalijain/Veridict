const mongoose = require("mongoose");

const contestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    startTime: {
      type: Date,
      required: true,
    },

    endTime: {
      type: Date,
      required: true,
    },

    duration: {
      type: Number, // minutes
      required: true,
    },

    problems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Problem",
      },
    ],

    registeredUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    status: {
      type: String,
      enum: ["Upcoming", "Running", "Ended"],
      default: "Upcoming",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Contest", contestSchema);