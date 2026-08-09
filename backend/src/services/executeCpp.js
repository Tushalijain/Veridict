const fs = require("fs");
const { spawn } = require("child_process");
const path = require("path");

const cleanupFiles = require("../utils/cleanupFiles");
const VERDICTS = require("../constants/verdicts");

const executeCpp = (filePath, input = "") => {
    const dir = path.dirname(filePath);

    const executable =
        process.platform === "win32" ? "Main.exe" : "Main";

    const executablePath = path.join(dir, executable);

    return new Promise((resolve, reject) => {

        // Make sure source file exists
        if (!fs.existsSync(filePath)) {
            return reject({
                type: VERDICTS.COMPILATION_ERROR,
                message: `C++ source file not found: ${filePath}`,
            });
        }

        console.log("===== C++ EXECUTION =====");
        console.log("Source file:", filePath);
        console.log("Source exists:", fs.existsSync(filePath));
        console.log("Executable:", executablePath);

        // =========================
        // COMPILE C++
        // =========================

        const compile = spawn("g++", [
            filePath,
            "-o",
            executablePath,
        ]);

        let compileError = "";

        compile.stderr.on("data", (data) => {
            compileError += data.toString();
        });

        compile.on("error", (error) => {
            cleanupFiles(filePath, executablePath);

            reject({
                type: VERDICTS.COMPILATION_ERROR,
                message:
                    error.message || "Failed to start C++ compiler.",
            });
        });

        compile.on("close", (code) => {

            if (code !== 0) {
                console.log("===== C++ COMPILATION FAILED =====");
                console.log(compileError);

                cleanupFiles(filePath, executablePath);

                reject({
                    type: VERDICTS.COMPILATION_ERROR,
                    message:
                        compileError || "Compilation failed.",
                });

                return;
            }

            console.log("C++ compilation successful");
            console.log(
                "Executable exists:",
                fs.existsSync(executablePath)
            );

            // =========================
            // RUN C++ PROGRAM
            // =========================

            const execute = spawn(executablePath, [], {
                cwd: dir,
            });

            let output = "";
            let runtimeError = "";

            const timeout = setTimeout(() => {
                execute.kill();

                cleanupFiles(filePath, executablePath);

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

                cleanupFiles(filePath, executablePath);

                reject({
                    type: VERDICTS.RUNTIME_ERROR,
                    message:
                        error.message ||
                        "Failed to start C++ program.",
                });
            });

            execute.stdin.write(input);
            execute.stdin.end();

            execute.on("close", (code) => {
                clearTimeout(timeout);

                if (code !== 0) {
                    cleanupFiles(filePath, executablePath);

                    reject({
                        type: VERDICTS.RUNTIME_ERROR,
                        message:
                            runtimeError || "Runtime Error",
                    });

                    return;
                }

                // IMPORTANT:
                // Do NOT cleanup here.
                // judgeService may need the source file
                // for the next test case.

                resolve(output);
            });
        });
    });
};

module.exports = executeCpp;