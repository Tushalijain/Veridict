const express = require("express");
const router = express.Router();
const {createTestCase, getTestCases, getTestCaseById, updateTestCase, deleteTestCase} = require("../controllers/testCaseController");
router.post("/", createTestCase);
router.get("/", getTestCases);
router.get("/:id", getTestCaseById);
router.put("/:id", updateTestCase);
router.delete("/:id", deleteTestCase);

module.exports = router;