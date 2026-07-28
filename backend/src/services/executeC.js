const { spawn } = require("child_process");
const path = require("path");
const cleanupFiles = require("../utils/cleanupFiles");

const executeC = (filePath, input = "") => {

    const dir = path.dirname(filePath);
    const executable = process.platform === "win32" ? "Main.exe" : "Main";

    return new Promise((resolve, reject) => {

        // Compile C
        const fileName = path.basename(filePath);

        const compile = spawn("docker", [
            "run",
            "--rm",
            "--network", "none",
            "--memory", "128m",
            "--cpus", "1",
            "-v", `${dir}:/app`,
            "-w", "/app",
            "gcc:latest",
            "gcc",
            fileName,
            "-o",
            executable
        ]);

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

            // Run executable
            const execute = spawn("docker", [
            "run",
            "--rm",
            "-i",
            "--network", "none",
            "--memory", "128m",
            "--cpus", "1",
            "-v", `${dir}:/app`,
            "-w", "/app",
            "gcc:latest",
            `./${executable}`
        ]);

            const timeout = setTimeout(() => {

                execute.kill();

                cleanupFiles(
                    filePath,
                    path.join(dir, executable)
                );

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

            execute.stdin.write(input + "\n");
            execute.stdin.end();

            execute.on("close", (runCode) => {

                clearTimeout(timeout);

                cleanupFiles(
                    filePath,
                    path.join(dir, executable)
                );

                if (runCode !== 0) {

                    return reject({
                        type: "Runtime Error",
                        message: runtimeError || "Runtime Error"
                    });

                }

                resolve(output);

            });

        });

    });

};

module.exports = executeC;