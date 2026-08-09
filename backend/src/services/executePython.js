const fs = require("fs");
const { spawn } = require("child_process");

const cleanupFiles = require("../utils/cleanupFiles");
const VERDICTS = require("../constants/verdicts");

const executePython = (filePath, input = "") => {
    return new Promise((resolve, reject) => {

        // Check that generated file exists
        if (!fs.existsSync(filePath)) {
            return reject({
                type: VERDICTS.RUNTIME_ERROR,
                message: `Python source file not found: ${filePath}`,
            });
        }

        console.log("===== PYTHON EXECUTION =====");
        console.log("Python file:", filePath);
        console.log("Python file exists:", fs.existsSync(filePath));

        // Execute Python directly
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

            cleanupFiles(filePath);

            if (code !== 0) {
                console.log("===== PYTHON RUNTIME ERROR =====");
                console.log(runtimeError);

                reject({
                    type: VERDICTS.RUNTIME_ERROR,
                    message: runtimeError || "Runtime Error",
                });

                return;
            }

            resolve(output);
        });
    });
};

module.exports = executePython;