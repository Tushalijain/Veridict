const executeCode = require("./executeService");
const generateFile = require("./generateFile");
const compareOutput = require("../utils/compareOutput");
const VERDICTS = require("../constants/verdicts");

const judgeService = async (language, code, testCases) => {
  const filePath = await generateFile(language, code);

  let executionTime = 0;

  for (const testCase of testCases) {
    try {
      const start = Date.now();

      const output = await executeCode(
        language,
        filePath,
        testCase.input
      );

      executionTime = Date.now() - start;

      if (!compareOutput(output, testCase.output)) {
        return {
          verdict: VERDICTS.WRONG_ANSWER,
          passed: false,
          executionTime,
          input: testCase.input,
          expected: testCase.output,
          output,
        };
      }
    } catch (error) {
      return {
        verdict: error.type || VERDICTS.RUNTIME_ERROR,
        passed: false,
        executionTime: 0,
        error: error.message || String(error),
      };
    }
  }

  return {
    verdict: VERDICTS.ACCEPTED,
    passed: true,
    executionTime,
  };
};

module.exports = judgeService;