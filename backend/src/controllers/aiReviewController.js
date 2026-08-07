const reviewCode = require("../services/aiReviewService");

const getCodeReview = async (req, res) => {
  try {
    console.log("✅ AI Review API hit");
    const { language, code } = req.body;
    console.log(language);
console.log(code);
   
    if (!language || !code) {
      return res.status(400).json({
        success: false,
        message: "Language and code are required",
      });
    }

    const review = await reviewCode(language, code);

    return res.status(200).json({
      success: true,
      review,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  getCodeReview,
};