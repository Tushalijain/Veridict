const fs = require("fs");
const { spawn } = require("child_process");
const path = require("path");

const cleanupFiles = require("../utils/cleanupFiles");
const VERDICTS = require("../constants/verdicts");

const executeCpp = (filePath, input = "") => {
    return new Promise((resolve, reject) => {

        if (!fs.existsSync(filePath)) {
            return reject({
                type: VERDICTS.COMPILATION_ERROR,
                message: `C++ source file not found: ${filePath}`,
            });
        }

        const dir = path.dirname(filePath);
        const fileName = path.basename(filePath);

        console.log("===== DOCKER C++ EXECUTION =====");
        console.log("Source:", filePath);

        // Convert Windows path to Docker-compatible path
        const dockerPath = dir
            .replace(/\\/g, "/")
            .replace(/^([A-Za-z]):/, (_, drive) => {
                return `/${drive.toLowerCase()}`;
            });

        const dockerSource = `/code/${fileName}`;
        const dockerExecutable = `/code/main`;

        // Docker:
        // 1. Mount source directory
        // 2. Compile inside GCC container
        // 3. Run executable
        const command = `
            g++ ${dockerSource} -o ${dockerExecutable} &&
            ${dockerExecutable}
        `;

        const execute = spawn(
            "docker",
            [
                "run",
                "--rm",
                "-i",
                "-v",
                `${dockerPath}:/code`,
                "gcc:latest",
                "bash",
                "-c",
                command,
            ]
        );

        let output = "";
        let errorOutput = "";

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
            errorOutput += data.toString();
        });

        execute.on("error", (error) => {
            clearTimeout(timeout);

            cleanupFiles(filePath);

            reject({
                type: VERDICTS.RUNTIME_ERROR,
                message: error.message,
            });
        });

        // Send input to the Docker container
        execute.stdin.write(input);
        execute.stdin.end();

        execute.on("close", (code) => {
            clearTimeout(timeout);

            cleanupFiles(filePath);

            if (code !== 0) {
                console.log("===== DOCKER C++ FAILED =====");
                console.log(errorOutput);

                reject({
                    type: VERDICTS.COMPILATION_ERROR,
                    message: errorOutput || "C++ execution failed.",
                });

                return;
            }

            console.log("===== DOCKER C++ SUCCESS =====");
            console.log("Output:", output);

            resolve(output);
        });
    });
};

module.exports = executeCpp;