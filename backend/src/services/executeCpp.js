const { spawn } = require("child_process");
const path = require("path");
const cleanupFiles = require("../utils/cleanupFiles");
const VERDICTS = require("../constants/verdicts");

const compiledExecutables = new Map();

const executeCpp = (filePath, input = "") => {
  const dir = path.dirname(filePath);
  const fileName = path.basename(filePath);
  const executable =
    process.platform === "win32" ? "Main.exe" : "Main";

  return new Promise((resolve, reject) => {
    const runProgram = () => {
      const execute = spawn("docker", [
        "run",
        "--rm",
        "-i",
        "--network",
        "none",
        "--memory",
        "128m",
        "--cpus",
        "1",
        "-v",
        `${dir}:/app`,
        "-w",
        "/app",
        "gcc:latest",
        `./${executable}`,
      ]);

      const timeout = setTimeout(() => {
        execute.kill();

        reject({
          type: VERDICTS.TIME_LIMIT_EXCEEDED,
          message: "Program exceeded 2 seconds.",
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

      execute.on("close", (runCode) => {
        clearTimeout(timeout);

        if (runCode !== 0) {
          return reject({
            type: VERDICTS.RUNTIME_ERROR,
            message: runtimeError || "Runtime Error",
          });
        }

        resolve(output);
      });
    };

    if (compiledExecutables.has(filePath)) {
      return runProgram();
    }

    const compile = spawn("docker", [
      "run",
      "--rm",
      "--network",
      "none",
      "--memory",
      "128m",
      "--cpus",
      "1",
      "-v",
      `${dir}:/app`,
      "-w",
      "/app",
      "gcc:latest",
      "g++",
      fileName,
      "-o",
      executable,
    ]);

    let compileError = "";

    compile.stderr.on("data", (data) => {
      compileError += data.toString();
    });

    compile.on("close", (code) => {
      if (code !== 0) {
        cleanupFiles(filePath);

        return reject({
          type: VERDICTS.COMPILATION_ERROR,
          message: compileError || "Compilation failed.",
        });
      }

      compiledExecutables.set(filePath, true);

      runProgram();
    });
  });
};

module.exports = executeCpp;