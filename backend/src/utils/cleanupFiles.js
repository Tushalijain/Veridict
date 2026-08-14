const fs = require("fs");

const cleanupFiles = (...files) => {
    files.forEach((file) => {
        try {
            if (file && fs.existsSync(file)) {
                const stats = fs.statSync(file);

                if (stats.isDirectory()) {
                    fs.rmSync(file, {
                        recursive: true,
                        force: true
                    });
                } else {
                    fs.unlinkSync(file);
                }
            }
        } catch (err) {
            console.log("Cleanup warning:", err.message);
        }
    });
};

module.exports = cleanupFiles;