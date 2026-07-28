const { spawn } = require("child_process");
const path = require("path");
const cleanupFiles = require("../utils/cleanupFiles");

const executeJava = (filePath, input = "") => {

    const dir = path.dirname(filePath);

    return new Promise((resolve, reject) => {

        // Compile Main.java
       const fileName = path.basename(filePath);

        const compile = spawn("docker", [
            "run",
            "--rm",
            "--network", "none",
            "--memory", "128m",
            "--cpus", "1",
            "-v", `${dir}:/app`,
            "-w", "/app",
            "eclipse-temurin:21",
            "javac",
            fileName
        ]);

        let compileError = "";

        compile.stderr.on("data", (data) => {
            compileError += data.toString();
        });

        compile.on("close", (code) => {

            if (code !== 0) {

                cleanupFiles(filePath);

                // Remove local file path from error
                const cleanedError = compileError.replace(
                    new RegExp(filePath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
                    "Main.java"
                );

                const VERDICTS = require("../constants/verdicts");

                return reject({
                    type: VERDICTS.COMPILATION_ERROR,
                    message: "Compilation failed."
                });
            }

            // Run Main.class
            const execute = spawn("docker", [
            "run",
            "--rm",
            "-i",
            "--network", "none",
            "--memory", "128m",
            "--cpus", "1",
            "-v", `${dir}:/app`,
            "-w", "/app",
            "eclipse-temurin:21",
            "java",
            "Main"
        ]);
            // Time Limit (2 seconds)
            const timeout = setTimeout(() => {

                execute.kill();

                cleanupFiles(
                    filePath,
                    path.join(dir, "Main.class")
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
                    path.join(dir, "Main.class")
                );

                if (runCode !== 0) {
                    return reject({
                        type: "Runtime Error",
                        message: "Runtime Error."
                    });
                }

                resolve(output);

            });

        });

    });

};

module.exports = executeJava;