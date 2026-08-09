const fs = require("fs");
const { spawn } = require("child_process");

const cleanupFiles = require("../utils/cleanupFiles");
const VERDICTS = require("../constants/verdicts");

const executePython = (filePath, input = "") => {
    return new Promise((resolve, reject) => {

        // Make sure Python source exists
        if (!fs.existsSync(filePath)) {
            return reject({
                type: VERDICTS.RUNTIME_ERROR,
                message: `Python source file not found: ${filePath}`,
            });
        }

        console.log("===== PYTHON EXECUTION =====");
        console.log("File:", filePath);
        console.log("File exists:", fs.existsSync(filePath));

        const execute = spawn("python3", [filePath]);

        let output = "";
        let runtimeError = "";

        const timeout = setTimeout(() => {
            execute.kill();

            cleanupFiles(filePath);

            reject({
                type: VERDICTS.TIME_LIMIT_EXCEEDED,
                message: "Program exceeded 2 seconds.",
            });
        }, 2000);

        execute.stdout.on("data", (data) => {
            output += data.toString();
        });

        execute.stderr.on("data", (data) => {
            runtimeError += data.toString();
        });

        execute.on("error", (error) => {
            clearTimeout(timeout);

            cleanupFiles(filePath);

            reject({
                type: VERDICTS.RUNTIME_ERROR,
                message: error.message || "Failed to start Python.",
            });
        });

        execute.stdin.write(input);
        execute.stdin.end();

        execute.on("close", (code) => {
            clearTimeout(timeout);

            if (code !== 0) {
                cleanupFiles(filePath);

                reject({
                    type: VERDICTS.RUNTIME_ERROR,
                    message: runtimeError || "Runtime Error",
                });

                return;
            }

            // IMPORTANT:
            // Do NOT cleanup here.
            // judgeService handles cleanup after ALL test cases.

            resolve(output);
        });
    });
};

module.exports = executePython;