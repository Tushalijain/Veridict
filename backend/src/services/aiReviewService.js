const axios = require("axios");

const reviewCode = async (language, code) => {

  const prompt = `
You are an expert Competitive Programming Mentor.

Review the following ${language} code.

IMPORTANT RULES:
- Keep the review under 200 words.
- Use simple English.
- Be beginner friendly.
- Do NOT explain every line of code.
- Do NOT write long paragraphs.
- Keep every section short (1-3 bullet points).

Return ONLY in this format:

# ⭐ Score
X/10

# ✅ What's Good
- ...
- ...

# ⚠️ Improvements
- ...
- ...

# 📊 Complexity
Time Complexity: O(?)
Space Complexity: O(?)

# 💡 Better Version
Provide only the improved code inside a code block.

# 🏁 Final Verdict
Write only 1-2 short sentences.

Code:

${code}
`;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-oss-20b:free",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5000",
          "X-Title": "Online Judge AI Review",
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.log("OpenRouter Error:");
    console.log(error.response?.status);
    console.log(error.response?.data);
    throw error;
  }
};

module.exports = reviewCode;