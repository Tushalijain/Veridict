const { spawn } = require("child_process");
const path = require("path");
const cleanupFiles = require("../utils/cleanupFiles");
const VERDICTS = require("../constants/verdicts");

const executeJava = (filePath, input = "") => {
  const dir = path.dirname(filePath);
  const fileName = path.basename(filePath);

  return new Promise((resolve, reject) => {
    // Compile Main.java
    const compile = spawn("javac", [fileName], {
      cwd: dir,
    });

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

      // Execute Main.class
      const execute = spawn("java", ["Main"], {
        cwd: dir,
      });

      const timeout = setTimeout(() => {
        execute.kill();

        cleanupFiles(filePath, path.join(dir, "Main.class"));

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

        cleanupFiles(filePath, path.join(dir, "Main.class"));

        if (runCode !== 0) {
          return reject({
            type: VERDICTS.RUNTIME_ERROR,
            message: runtimeError || "Runtime Error",
          });
        }

        resolve(output);
      });
    });
  });
};

module.exports = executeJava;