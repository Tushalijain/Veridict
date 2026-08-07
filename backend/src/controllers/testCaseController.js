const TestCase = require("../models/TestCase");

// Create Test Case
const createTestCase = async (req, res) => {
  try {
    const testCase = await TestCase.create(req.body);

    res.status(201).json(testCase);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Test Cases
const getTestCases = async (req, res) => {
  try {
    const testCases = await TestCase.find();

    res.status(200).json(testCases);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Test Case By ID
const getTestCaseById = async (req, res) => {
  try {
    const testCase = await TestCase.findById(req.params.id);

    if (!testCase) {
      return res.status(404).json({
        message: "Test case not found",
      });
    }

    res.status(200).json(testCase);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Test Case
const updateTestCase = async (req, res) => {
  try {
    const testCase = await TestCase.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!testCase) {
      return res.status(404).json({
        message: "Test case not found",
      });
    }

    res.status(200).json(testCase);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Test Case
const deleteTestCase = async (req, res) => {
  try {
    const testCase = await TestCase.findByIdAndDelete(req.params.id);

    if (!testCase) {
      return res.status(404).json({
        message: "Test case not found",
      });
    }

    res.status(200).json({
      message: "Test case deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createTestCase,
  getTestCases,
  getTestCaseById,
  updateTestCase,
  deleteTestCase,
};