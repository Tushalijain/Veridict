const axios = require("axios");

const reviewCode = async (language, code, problemStatement) => {

  const prompt = `
You are an expert Competitive Programming Mentor.

Your job is to review a student's submitted code AGAINST THE GIVEN PROBLEM STATEMENT.

IMPORTANT:
The problem statement is the source of truth.

Do NOT assume that the submitted code is correct.
First determine what the problem actually asks.
Then determine whether the submitted code solves that problem.

Problem Statement:
${problemStatement}

Student Language:
${language}

Student Code:
${code}

IMPORTANT RULES:

- Keep the review under 200 words.
- Use simple English.
- Be beginner friendly.
- Do NOT explain every line of code.
- Do NOT write long paragraphs.
- Keep every section short (1-3 bullet points).
- Compare the code directly against the problem requirements.
- Identify logical errors even if the submitted code itself compiles and runs.
- Do NOT praise code for producing an output that does not satisfy the problem.
- If the code solves a different problem, clearly explain that.
- If the submission is incorrect, provide a useful approach hint.
- The hint should guide the learner toward the correct algorithm.
- Do NOT give the complete solution in the hint.
- Do NOT claim the code is correct unless it actually solves the given problem.

Return ONLY in this format:

# ⭐ Score

X/10

# ✅ What's Good

- ...
- ...

# ⚠️ Improvements

- ...
- ...

# 💡 Approach Hint

- Explain the key idea or direction the student should think about.
- Do not provide the complete solution.

# 📊 Complexity

Time Complexity: O(?)
Space Complexity: O(?)

# 💡 Better Version

Provide the corrected version of the code inside a code block.

# 🏁 Final Verdict

Write only 1-2 short sentences.
Clearly state whether the submitted code solves the given problem.

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
  console.error("OpenRouter Error:");

  console.error(error.response?.data || error.message);

  throw new Error(
    error.response?.data?.error?.message ||
    error.response?.data?.message ||
    "AI Review failed"
  );
}
};

module.exports = reviewCode;