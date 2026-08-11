const executeDocker = require("./executeDocker");

const executeCode = async (language, filePath, input = "") => {
    return await executeDocker(language, filePath, input);
};

module.exports = executeCode;