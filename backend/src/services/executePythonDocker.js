const { spawn } = require("child_process");
const path = require("path");
const VERDICTS = require("../constants/verdicts");
const executePythonDocker = (filePath, input = "") => {
  return new Promise((resolve, reject) => {

    const fileName = path.basename(filePath);

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

        "-v",
        `${path.dirname(filePath)}:/app`,

        "-w",
        "/app",

        "python:3.11",

        "python",
        fileName,
        ]);

    let output = "";
    let error = "";

   docker.stdin.write(input + "\n");
    docker.stdin.end();

    docker.stdout.on("data", (data) => {
      output += data.toString();
    });

    docker.stderr.on("data", (data) => {
    console.log("PYTHON STDERR:", data.toString());
    error += data.toString();
});

   docker.on("error", (err) => {
    reject({
        type: VERDICTS.RUNTIME_ERROR,
        message: err.message
    });
});

docker.on("close", (code) => {

    console.log("Docker Exit Code:", code);
    console.log("Docker STDOUT:", JSON.stringify(output));
    console.log("Docker STDERR:", JSON.stringify(error));

    if (code === 0) {
        resolve(output);
    } else {
        reject({
            type: VERDICTS.RUNTIME_ERROR,
            message: error || "Execution Failed"
        });
    }

});

  });
};

module.exports = executePythonDocker;