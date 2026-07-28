const executeCode = require("./executeService");
const generateFile = require("./generateFile");
const compareOutput = require("../utils/compareOutput");
const VERDICTS = require("../constants/verdicts");

const judgeService = async (language, code, testCases) => {

    // Generate source file
    const filePath = await generateFile(language, code);
    let executionTime = 0;

    // Execute each test case
    for (const testCase of testCases) {

        try {

            const start = Date.now();

            const output = await executeCode(
                language,
                filePath,
                testCase.input
            );

            const end = Date.now();
            executionTime = end - start;

            if (!compareOutput(output, testCase.output)) {

                return {
                    verdict: VERDICTS.WRONG_ANSWER,
                    passed: false,
                    executionTime,
                    input: testCase.input,
                    expected: testCase.output,
                    output
                };

            }

        } catch (error) {

            return {
                verdict: error.type,
                passed: false,
                executionTime: 0,
                error: error.message
            };

        }

    }

    return {
    verdict: VERDICTS.ACCEPTED,
    passed: true,
    executionTime
};

};

module.exports = judgeService;