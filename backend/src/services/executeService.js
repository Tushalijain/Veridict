const executePython = require("./executePython");
const executeCpp = require("./executeCpp");
const executeC = require("./executeC");
const executeJava = require("./executeJava");

const executeCode = async (language, filePath, input = "") => {
    switch (language) {
        case "python":
            return await executePython(filePath, input);

        case "cpp":
            return await executeCpp(filePath, input);

        case "c":
            return await executeC(filePath, input);

        case "java":
            return await executeJava(filePath, input);

        default:
            throw new Error("Unsupported language");
    }
};

module.exports = executeCode;