const executeCode = require("./executeService");
const generateFile = require("./generateFile");
const compareOutput = require("../utils/compareOutput");
const path = require("path");
const cleanupFiles = require("../utils/cleanupFiles");
const VERDICTS = require("../constants/verdicts");

const judgeService = async (language, code, testCases) => {
     console.log("===== JUDGE START =====");
    console.log("Language:", language);
    console.log("Number of test cases:", testCases.length);
    console.log("Test cases:", testCases);

    const filePath = await generateFile(language, code);
    console.log("===== JUDGE FILE =====");
console.log("Language:", language);
console.log("File:", filePath);

    let executionTime = 0;

    try {
        for (const testCase of testCases) {
            console.log("===== CURRENT TEST CASE =====");
console.log("Input:", JSON.stringify(testCase.input));
console.log("Expected:", JSON.stringify(testCase.output));
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
                console.log("===== JUDGE EXECUTION ERROR =====");
                console.log("Language:", language);
                console.log("File:", filePath);
                console.log("Error type:", error.type);
                console.log("Error message:", error.message);
                console.log("Full error:", error);

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

    } finally {
    console.log("===== CLEANUP START =====");
    console.log("Language:", language);
    console.log("File path:", filePath);

    if (language === "java") {
        const javaDir = path.dirname(filePath);

        console.log("Removing Java directory:", javaDir);

        cleanupFiles(javaDir);
    } else {
        console.log("Removing file:", filePath);

        cleanupFiles(filePath);
    }

    console.log("===== CLEANUP END =====");
}
};

module.exports = judgeService;