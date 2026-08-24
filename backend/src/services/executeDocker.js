const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const VERDICTS = require("../constants/verdicts");

console.log("🔥 executeDocker.js LOADED");

const executeDocker = (language, filePath, input = "") => {
    return new Promise((resolve, reject) => {

        const dir = path.dirname(filePath);
        const fileName = path.basename(filePath);

        let image;
        let command = [];

        // --------------------------------
        // Select Docker image + command
        // --------------------------------

        if (language === "python") {

            image = "python:3.11";

            command = [
                "python",
                fileName
            ];

        } else if (language === "c") {

            image = "gcc:latest";

            command = [
                "bash",
                "-c",
                `gcc "${fileName}" -o /tmp/main && /tmp/main`
            ];

        } else if (language === "cpp") {

            image = "gcc:latest";

            command = [
                "bash",
                "-c",
                `g++ "${fileName}" -o /tmp/main && /tmp/main`
            ];

        } else if (language === "java") {

            image = "eclipse-temurin:17-jdk";

            command = [
                "bash",
                "-c",
                `javac Main.java && java Main`
            ];

        } else {

            return reject({
                type: VERDICTS.INTERNAL_SYSTEM_ERROR,
                message: "Unsupported language."
            });
        }

        console.log("===== DOCKER EXECUTION =====");
        console.log("Language:", language);
        console.log("Image:", image);
        console.log("File:", filePath);
        console.log("File exists:", fs.existsSync(filePath));

        // --------------------------------
        // Start Docker container
        // --------------------------------

        const docker = spawn(
            "docker",
            [
                "run",
                "--rm",
                "-i",

                // Disable network access
                "--network",
                "none",

                // Increased memory for compiler
                "--memory",
                "512m",

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
            ]
        );

        let output = "";
        let error = "";

        // --------------------------------
        // STDOUT
        // --------------------------------

        docker.stdout.on("data", (data) => {
            output += data.toString();
        });

        // --------------------------------
        // STDERR
        // --------------------------------

        docker.stderr.on("data", (data) => {
            error += data.toString();
        });

        // --------------------------------
        // Docker process failed
        // --------------------------------

        docker.on("error", (err) => {

            reject({
                type: VERDICTS.INTERNAL_SYSTEM_ERROR,
                message: `Docker execution failed: ${err.message}`
            });

        });

        // --------------------------------
        // Timeout
        // --------------------------------

        const timeout = setTimeout(() => {

            docker.kill();

            reject({
                type: VERDICTS.TIME_LIMIT_EXCEEDED,
                message: "Program exceeded 2 seconds."
            });

        }, 2000);

        // --------------------------------
        // Send input
        // --------------------------------

        docker.stdin.write(input);
        docker.stdin.end();

        // --------------------------------
        // Process finished
        // --------------------------------

        docker.on("close", (code) => {

            clearTimeout(timeout);

            console.log("Docker exit code:", code);
            console.log("Docker output:", JSON.stringify(output));
            console.log("Docker error:", JSON.stringify(error));

            // --------------------------------
            // Successful execution
            // --------------------------------

            if (code === 0) {

                resolve(output);
                return;

            }

            // --------------------------------
            // Infrastructure / Docker errors
            // --------------------------------

            if (
                code === 137 ||
                code === 125 ||
                error.includes("Killed signal") ||
                error.includes("Cannot connect to the Docker daemon") ||
                error.includes("permission denied") ||
                error.includes("No such image") ||
                error.includes("pull access denied") ||
                error.includes("failed to resolve reference") ||
                error.includes("docker:")
            ) {

                reject({
                    type: VERDICTS.INTERNAL_SYSTEM_ERROR,
                    message: error || "Internal Docker execution error."
                });

                return;
            }

            // --------------------------------
            // Compilation errors
            // --------------------------------

            if (
    language === "c" ||
    language === "cpp" ||
    language === "java"
) {
    // Infrastructure / Docker / compiler process failures
    const isSystemError =
        error.includes("Killed signal") ||
        error.includes("Cannot connect to the Docker daemon") ||
        error.includes("permission denied") ||
        error.includes("No such file or directory") ||
        error.includes("failed to solve") ||
        error.includes("pull access denied") ||
        error.includes("not found") ||
        error.includes("OCI runtime") ||
        error.includes("containerd");

    if (isSystemError) {
        reject({
            type: VERDICTS.INTERNAL_SYSTEM_ERROR,
            message: error || "Internal system error."
        });

        return;
    }

    // Genuine compilation errors
    const isCompilationError =
        error.includes("error:") ||
        error.includes("fatal error") ||
        error.includes("cannot find symbol") ||
        error.includes("expected");

    if (isCompilationError) {
        reject({
            type: VERDICTS.COMPILATION_ERROR,
            message: error || "Compilation failed."
        });

        return;
    }
}

            // --------------------------------
            // Normal runtime error
            // --------------------------------

            reject({
                type: VERDICTS.RUNTIME_ERROR,
                message: error || "Runtime Error"
            });
        });
    });
};

module.exports = executeDocker;
