const { spawn } = require("child_process");
const cleanupFiles = require("../utils/cleanupFiles");
const executePython = (filePath, input = "") => {
    return new Promise((resolve, reject) => {
        // Check Python syntax first
        const compile = spawn("python3", ["-m", "py_compile", filePath]);
        let compileError = "";
        compile.stderr.on("data", (data) => {
            compileError += data.toString();
        });
        compile.on("close", (code) => {
            if (code !== 0) {
                cleanupFiles(filePath);
                const VERDICTS = require("../constants/verdicts");
                return reject({
                    type: VERDICTS.COMPILATION_ERROR,
                    message: "Compilation failed."
                });
            }
            // Execute Python file
            const execute = spawn("python3", [filePath]);
            const timeout = setTimeout(() => {
                execute.kill();
                cleanupFiles(filePath);
                return reject({
                    type: "Time Limit Exceeded",
                    message: "Program exceeded 2 seconds."
                });
            }, 2000);
            let output = "";
            let runtimeError = "";
            execute.stdout.on("data", (data) => {
                output += data.toString();
            });
            execute.stderr.on("data", (data) => {
                runtimeError += data.toString();
            });
            execute.stdin.write(input);
            execute.stdin.end();
            execute.on("close", (code) => {
                clearTimeout(timeout);
                cleanupFiles(filePath);
                if (code !== 0) {
                    return reject({
                        type: "Runtime Error",
                        message: "Runtime Error"
                    });
                }
                resolve(output);
            });
        });
    });
};
module.exports = executePython;