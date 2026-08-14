const { spawn } = require("child_process");

const code = `
#include <iostream>
using namespace std;

int main() {
    cout << 2 + 3;
    return 0;
}
`;

const command = `
echo '${code}' > /tmp/main.cpp &&
g++ /tmp/main.cpp -o /tmp/main &&
/tmp/main
`;

const docker = spawn("docker", [
    "run",
    "--rm",
    "gcc:latest",
    "bash",
    "-c",
    command
]);

docker.stdout.on("data", (data) => {
    console.log("OUTPUT:", data.toString());
});

docker.stderr.on("data", (data) => {
    console.log("ERROR:", data.toString());
});

docker.on("close", (code) => {
    console.log("Exit code:", code);
});