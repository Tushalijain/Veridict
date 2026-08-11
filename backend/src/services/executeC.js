const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const cleanupFiles = require("../utils/cleanupFiles");
const VERDICTS = require("../constants/verdicts");

const executeC = (filePath, input = "") => {
    return new Promise((resolve, reject) => {
        const dir = path.dirname(filePath);
        const fileName = path.basename(filePath);

        const executable =
            process.platform === "win32"
                ? "Main.exe"
                : "Main";

        const executablePath = path.join(dir, executable);

        // =========================
        // CHECK SOURCE FILE
        // =========================

        if (!fs.existsSync(filePath)) {
            return reject({
                type: VERDICTS.COMPILATION_ERROR,
                message: `C source file not found: ${filePath}`,
            });
        }

        console.log("===== C PATH DEBUG =====");
        console.log("filePath:", filePath);
        console.log("dirname:", dir);
        console.log("fileName:", fileName);
        console.log("exists:", fs.existsSync(filePath));
        console.log("directory exists:", fs.existsSync(dir));
        console.log("directory files:", fs.readdirSync(dir));

        // =========================
        // COMPILE C
        // =========================

        const compile = spawn(
            "gcc",
            [
                fileName,
                "-o",
                executable,
            ],
            {
                cwd: dir,
            }
        );

        let compileError = "";

        compile.stdout.on("data", (data) => {
            console.log("GCC:", data.toString());
        });

        compile.stderr.on("data", (data) => {
            compileError += data.toString();
        });

        compile.on("error", (error) => {
            cleanupFiles(executablePath);

            return reject({
                type: VERDICTS.COMPILATION_ERROR,
                message:
                    error.message ||
                    "Unable to start GCC compiler.",
            });
        });

        compile.on("close", (code) => {
            // =========================
            // COMPILATION ERROR
            // =========================

            if (code !== 0) {
                console.log("===== C COMPILATION ERROR =====");
                console.log(compileError);

                cleanupFiles(executablePath);

                return reject({
                    type: VERDICTS.COMPILATION_ERROR,
                    message:
                        compileError ||
                        "Compilation failed.",
                });
            }

            console.log("===== C COMPILATION SUCCESS =====");
            console.log(
                "Executable exists:",
                fs.existsSync(executablePath)
            );

            // =========================
            // EXECUTE PROGRAM
            // =========================

            const executePath =
                process.platform === "win32"
                    ? executablePath
                    : `./${executable}`;

            const execute = spawn(
                executePath,
                [],
                {
                    cwd: dir,
                }
            );

            let output = "";
            let runtimeError = "";

            // =========================
            // TIME LIMIT
            // =========================

            const timeout = setTimeout(() => {
                execute.kill();

                cleanupFiles(executablePath);

                return reject({
                    type: VERDICTS.TIME_LIMIT_EXCEEDED,
                    message: "Program exceeded 2 seconds.",
                });
            }, 2000);

            // =========================
            // STDOUT
            // =========================

            execute.stdout.on("data", (data) => {
                output += data.toString();
            });

            // =========================
            // STDERR
            // =========================

            execute.stderr.on("data", (data) => {
                runtimeError += data.toString();
            });

            // =========================
            // EXECUTION ERROR
            // =========================

            execute.on("error", (error) => {
                clearTimeout(timeout);

                cleanupFiles(executablePath);

                return reject({
                    type: VERDICTS.RUNTIME_ERROR,
                    message:
                        error.message ||
                        "Failed to execute C program.",
                });
            });

            // =========================
            // SEND INPUT
            // =========================

            execute.stdin.write(input);
            execute.stdin.end();

            // =========================
            // EXECUTION FINISHED
            // =========================

            execute.on("close", (code) => {
                clearTimeout(timeout);

                // Delete executable only.
                // judgeService deletes source file
                // after all test cases are finished.
                cleanupFiles(executablePath);

                if (code !== 0) {
                    return reject({
                        type: VERDICTS.RUNTIME_ERROR,
                        message:
                            runtimeError ||
                            "Runtime Error",
                    });
                }

                resolve(output);
            });
        });
    });
};

module.exports = executeC;