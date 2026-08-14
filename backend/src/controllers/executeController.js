const generateFile = require("../services/generateFile");
const executeCodeService = require("../services/executeService");

const executeCode = async (req, res) => {
    console.log("🔥 EXECUTE CONTROLLER HIT");
console.log("Body:", req.body);
    try {
        const { language, code, input } = req.body;

        if (!language || !code) {
            return res.status(400).json({
                success: false,
                verdict: "Bad Request",
                message: "Language and code are required"
            });
        }

        // Generate source file
        const filePath = await generateFile(language, code);

        // Execute code
        const output = await executeCodeService(
            language,
            filePath,
            input || ""
        );

    const VERDICTS = require("../constants/verdicts");

    return res.status(200).json({
        success: true,
        verdict: VERDICTS.ACCEPTED,
        output,
        error: ""
    });

    } catch (error) {

        return res.status(500).json({
            success: false,
            verdict: error.type,
            output: "",
            error: error.message
});

    }
};

module.exports = {
    executeCode
};