const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  statement: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    required: true
  },
  constraints: {
    type: String
  },
  examples: [
  {
    input: String,
    output: String,
    explanation: String,
  },
],
  code: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model("Problem", problemSchema);