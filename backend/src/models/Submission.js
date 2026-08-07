const mongoose = require("mongoose");
const VERDICTS = require("../constants/verdicts");

const submissionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        problem: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Problem",
            required: true
        },
         contest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Contest",
        default: null
    },
        language: {
            type: String,
            required: true,
            enum: ["python", "cpp", "c", "java"]
        },

        code: {
            type: String,
            required: true
        },

        verdict: {
            type: String,
            required: true,
            enum: Object.values(VERDICTS)
        },

        executionTime: {
            type: Number,
            default: 0
        },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Submission", submissionSchema);