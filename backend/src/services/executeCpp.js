const { spawn } = require("child_process");
const path = require("path");
const cleanupFiles = require("../utils/cleanupFiles");
const VERDICTS = require("../constants/verdicts");

const executeCpp = (filePath, input = "") => {
  const dir = path.dirname(filePath);
  const fileName = path.basename(filePath);

  const executable =
    process.platform === "win32" ? "Main.exe" : "Main";

  const executablePath = path.join(dir, executable);

  return new Promise((resolve, reject) => {

    // =========================
    // COMPILE C++
    // =========================
    const compile = spawn(
      "g++",
      [fileName, "-o", executable],
      {
        cwd: dir,
      }
    );

    let compileError = "";

    compile.stderr.on("data", (data) => {
      compileError += data.toString();
    });

    // Important: handles g++ not found / spawn failure
    compile.on("error", (error) => {
      cleanupFiles(filePath, executablePath);

      reject({
        type: VERDICTS.COMPILATION_ERROR,
        message: error.message || "Failed to start C++ compiler.",
      });
    });

    compile.on("close", (code) => {

      if (code !== 0) {
        cleanupFiles(filePath, executablePath);

        reject({
          type: VERDICTS.COMPILATION_ERROR,
          message: compileError || "Compilation failed.",
        });

        return;
      }

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

      // Important: handles executable start failure
      execute.on("error", (error) => {
        clearTimeout(timeout);

        cleanupFiles(filePath, executablePath);

        reject({
          type: VERDICTS.RUNTIME_ERROR,
          message: error.message || "Failed to start program.",
        });
      });

      execute.stdin.write(input);
      execute.stdin.end();

      execute.on("close", (code) => {
        clearTimeout(timeout);

        cleanupFiles(filePath, executablePath);

        if (code !== 0) {
          reject({
            type: VERDICTS.RUNTIME_ERROR,
            message: runtimeError || "Runtime Error",
          });

          return;
        }

        resolve(output);
      });
    });
  });
};

module.exports = executeCpp;