const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const VERDICTS = require("../constants/verdicts");

console.log("🔥 NEW executeDocker.js LOADED");

const executeDocker = (language, filePath, input = "") => {
    return new Promise((resolve, reject) => {
        const dir = path.dirname(filePath);
        const fileName = path.basename(filePath);

        let image;
        let command;

        // Select Docker image + execution command
        if (language === "python") {
            image = "python:3.11";
            command = ["python3", fileName];
        }

        else if (language === "c") {
            image = "gcc:latest";
            command = [
                "bash",
                "-c",
                `gcc "${fileName}" -o /tmp/main && /tmp/main`
            ];
        }

        else if (language === "cpp") {
            image = "gcc:latest";
            command = [
                "bash",
                "-c",
                `g++ "${fileName}" -o /tmp/main && /tmp/main`
            ];
        }

        else if (language === "java") {
            image = "eclipse-temurin:17-jdk";
            command = [
                "bash",
                "-c",
                `javac Main.java && java Main`
            ];
        }

        else {
            return reject({
                type: VERDICTS.RUNTIME_ERROR,
                message: "Unsupported language"
            });
        }

        console.log("===== DOCKER EXECUTION =====");
        console.log("Language:", language);
        console.log("Image:", image);
        console.log("File:", filePath);
        console.log("File exists:", fs.existsSync(filePath));

        const docker = spawn("docker", [
            "run",
            "--rm",
            "-i",

            "--network",
            "none",

            "--memory",
            "128m",

            "--cpus",
            "1",

            "--pids-limit",
            "64",

            "-v",
            `${dir}:/workspace`,

            "-w",
            "/workspace",

            image,

            ...command
        ]);

        let output = "";
        let error = "";
        let finished = false;

        // STDOUT
        docker.stdout.on("data", (data) => {
            output += data.toString();
        });

        // STDERR
        docker.stderr.on("data", (data) => {
            error += data.toString();
        });

        // Docker process failed to start
        docker.on("error", (err) => {
            if (finished) return;
            finished = true;

            reject({
                type: VERDICTS.RUNTIME_ERROR,
                message: `Docker execution failed: ${err.message}`
            });
        });

        // 2 second timeout
        const timeout = setTimeout(() => {
            if (finished) return;

            finished = true;
            docker.kill();

            reject({
                type: VERDICTS.TIME_LIMIT_EXCEEDED,
                message: "Program exceeded 2 seconds."
            });
        }, 2000);

        // Send input
        docker.stdin.write(input);
        docker.stdin.end();

        // Process finished
        docker.on("close", (code) => {
            if (finished) return;

            clearTimeout(timeout);
            finished = true;

            console.log("Docker exit code:", code);
            console.log("Docker output:", JSON.stringify(output));
            console.log("Docker error:", JSON.stringify(error));

            if (code === 0) {
                resolve(output);
                return;
            }

            // C / C++ / Java compilation errors
            if (
                language === "c" ||
                language === "cpp" ||
                language === "java"
            ) {
                const isCompilationError =
                    error.includes("error:") ||
                    error.includes("fatal error") ||
                    error.includes("cannot find symbol") ||
                    error.includes("class") ||
                    error.includes("expected");

                if (isCompilationError) {
                    reject({
                        type: VERDICTS.COMPILATION_ERROR,
                        message: error || "Compilation failed."
                    });

                    return;
                }
            }

            reject({
                type: VERDICTS.RUNTIME_ERROR,
                message: error || "Runtime Error"
            });
        });
    });
};

module.exports = executeDocker;
