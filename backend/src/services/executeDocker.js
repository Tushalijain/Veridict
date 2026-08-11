const { spawn } = require("child_process");
const path = require("path");
const VERDICTS = require("../constants/verdicts");

const executeDocker = (language, filePath, input = "") => {
    return new Promise((resolve, reject) => {
        const dir = path.dirname(filePath);
        const fileName = path.basename(filePath);

        let command = [];
        let compileError = "";

        // --------------------------------
        // Select language command
        // --------------------------------

        if (language === "python") {
            command = [
                "python3",
                fileName
            ];
        }

        else if (language === "c") {
            command = [
                "bash",
                "-c",
                `gcc "${fileName}" -o /tmp/main && /tmp/main`
            ];
        }

        else if (language === "cpp") {
            command = [
                "bash",
                "-c",
                `g++ "${fileName}" -o /tmp/main && /tmp/main`
            ];
        }

        else if (language === "java") {
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
        console.log("File:", filePath);
        console.log("File exists:", require("fs").existsSync(filePath));

        const docker = spawn("docker", [
            "run",
            "--rm",

            // Interactive stdin
            "-i",

            // Disable internet
            "--network",
            "none",

            // Memory limit
            "--memory",
            "128m",

            // CPU limit
            "--cpus",
            "1",

            // Limit processes
            "--pids-limit",
            "64",

            // Mount source directory
            "-v",
            `${dir}:/workspace`,

            // Working directory
            "-w",
            "/workspace",

            // Our Docker image
            "online-judge-backend",

            ...command
        ]);

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
        // Docker process failed to start
        // --------------------------------

        docker.on("error", (err) => {
            reject({
                type: VERDICTS.RUNTIME_ERROR,
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

            if (code === 0) {
                resolve(output);
                return;
            }

            // Java / C / C++ compilation errors
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