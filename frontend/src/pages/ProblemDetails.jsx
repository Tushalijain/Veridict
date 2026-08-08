import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import api from "../services/api";

import Editor from "@monaco-editor/react";
import ReactMarkdown from "react-markdown";
import { FaRobot } from "react-icons/fa";

const templates = {
  python: `def solve():
    pass

    if __name__ == "__main__":
        solve()
    `,

      cpp: `#include <bits/stdc++.h>
    using namespace std;

    int main() {

        return 0;
    }
    `,

      c: `#include <stdio.h>

    int main() {

        return 0;
    }
    `,

      java: `public class Main {
        public static void main(String[] args) {

        }
    }
    `
};

function ProblemDetails() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const contestId = searchParams.get("contest");
 console.log("Current URL:", window.location.href);
console.log("Contest ID:", contestId);
  const getStorageKey = (language) => `problem_${id}_${language}`;
  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState("");
  const [customInput, setCustomInput] = useState("");
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedExample, setSelectedExample] = useState(0);
 const [submissionResult, setSubmissionResult] = useState(null);
  const [review, setReview] = useState("");
  const [reviewing, setReviewing] = useState(false);


 useEffect(() => {
  console.log("submissionResult changed:", submissionResult);
}, [submissionResult]);

 useEffect(() => {
  fetchProblem();
}, [id]);

  useEffect(() => {
  const savedCode = localStorage.getItem(getStorageKey(language));

  if (savedCode) {
    setCode(savedCode);
  } else {
    setCode(templates[language]);
  }
}, [language, id]);

  const fetchProblem = async () => {
    try {
      const response = await api.get(`/problems/${id}`);
      setProblem(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  
  const runCode = async () => {
  try {
    setReview("");
    setRunning(true);
    setOutput("Running...");

   const response = await fetch(
  `${import.meta.env.VITE_API_URL}/compiler/run`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      language,
      code,
      input: customInput,
    }),
  }
);

    const data = await response.json();

    if (data.success) {
      setOutput(data.output);
    } else {
      setOutput(data.message || "Execution Failed");
    }
  } catch (error) {
    console.error(error);
    setOutput("Unable to connect to the server.");
  } finally {
    setRunning(false);
  }
};

const submitCode = async () => {
  try {
    setReview("");
    setSubmitting(true);
    setOutput("Submitting...");

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      setOutput("Please login first.");
      return;
    }

    const response = await api.post("/submissions", {
  userId: user._id,
  problemId: id,
  contestId,
  language,
  code,
});

    console.log("API Response:", response.data);
    console.log("Submission:", response.data.submission);

    if (response.data.success) {
      setSubmissionResult(response.data.submission);

      setOutput(
        `Verdict: ${response.data.submission.verdict}
Execution Time: ${response.data.submission.executionTime} ms`
      );
    } else {
      setOutput("Submission Failed");
    }
  } catch (error) {
  console.error(error);

  setOutput(
    error.response?.data?.message ||
    "Submission Failed"
  );
}finally {
    setSubmitting(false);
  }
};

const reviewCode = async () => {
  try {
    setReviewing(true);
    setReview("🤖 Reviewing your code...");

    const token = localStorage.getItem("token");

    const response = await api.post(
      "/review",
      {
        language,
        code,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.success) {
      setReview(response.data.review);
    } else {
      setReview("Unable to review code.");
    }
  } catch (error) {
    console.error(error);
    console.error(error.response?.data);

    setReview(
      error.response?.data?.message || "AI Review Failed."
    );
  } finally {
    setReviewing(false);
  }
};

const getVerdictColor = () => {
  if (output.includes("Accepted"))
    return "border-green-500 text-green-500";

  if (output.includes("Wrong Answer"))
    return "border-red-500 text-red-500";

  if (output.includes("Compilation Error"))
    return "border-yellow-500 text-yellow-500";

  if (output.includes("Runtime Error"))
    return "border-orange-500 text-orange-500";

  if (output.includes("Time Limit Exceeded"))
    return "border-purple-500 text-purple-500";

  return "border-gray-400 text-green-400";
};

const getDifficultyColor = () => {
  switch (problem.difficulty) {
    case "Easy":
      return "bg-green-100 text-green-700";

    case "Medium":
      return "bg-yellow-100 text-yellow-700";

    case "Hard":
      return "bg-red-100 text-red-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
};

  if (!problem) {
  return <h2 className="text-center mt-10">Loading...</h2>;
}

const example = problem.examples?.[selectedExample];

  return (
  <>
    

    <div className="min-h-screen bg-[#050816] text-white">
  <div className="max-w-[1600px] mx-auto px-8 lg:px-20 py-10">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* LEFT PANEL */}
        <div className="
bg-slate-900/70
border
border-slate-700
backdrop-blur-xl
rounded-2xl
p-8
h-[86vh]
overflow-y-auto
">

          <h1 className="text-5xl font-black mb-8">
            {problem.title}
          </h1>

          <h2 className="text-xl font-semibold mb-2">
            Problem Statement
          </h2>

          <p className="mb-8 text-slate-300 leading-8">
            {problem.statement}
          </p>

          <h2 className="text-xl font-bold text-cyan-400 mb-3">
  Difficulty
</h2>

<span
className={`inline-block px-4 py-2 rounded-full font-semibold mb-8
${
problem.difficulty==="Easy"
? "bg-green-500/20 text-green-400"
: problem.difficulty==="Medium"
? "bg-yellow-500/20 text-yellow-400"
: "bg-red-500/20 text-red-400"
}`}
>
  {problem.difficulty}
</span>

          <h2 className="text-xl font-semibold mb-2">
            Constraints
          </h2>

          <p className="text-slate-300 leading-8">
            {problem.constraints}
          </p>

         <h2 className="text-xl font-semibold mt-8 mb-4">
  Examples
</h2>

<div className="flex gap-3 mb-5">
  {problem.examples.map((_, index) => (
    <button
      key={index}
      onClick={() => setSelectedExample(index)}
      className={`px-4 py-2 rounded-lg font-semibold transition ${
        selectedExample===index
? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white"
: "bg-slate-800 border border-slate-700 text-slate-300 hover:border-cyan-500"
      }`}
    >
      Example {index + 1}
    </button>
  ))}
</div>

<div className="
border
border-slate-700
rounded-2xl
p-6
bg-slate-900/40
">

  <h3 className="font-semibold">Input</h3>

  <pre className="
bg-[#0F172A]
border
border-slate-700
rounded-xl
p-4
mt-2
text-green-400
font-mono
overflow-x-auto
">
    {example?.input}
  </pre>

  <h3 className="font-semibold mt-4">Output</h3>

  <pre className="
bg-[#0F172A]
border
border-slate-700
rounded-xl
p-4
mt-2
text-green-400
font-mono
overflow-x-auto
">
    {example?.output}
  </pre>

  <h3 className="font-semibold mt-4">Explanation</h3>

  <p className="mt-3 text-slate-300 leading-7">
    {example?.explanation}
  </p>

</div>

        </div>

        {/* RIGHT PANEL */}
        <div className="
bg-slate-900/70
border
border-slate-700
backdrop-blur-xl
rounded-2xl
p-8
flex
flex-col
h-[86vh]
">

          <label className="
font-bold
text-cyan-400
mb-3
text-lg
">
            Language
          </label>

          <select
            value={language}
           onChange={(e) => {
              const selectedLanguage = e.target.value;

              setLanguage(selectedLanguage);

              const savedCode = localStorage.getItem(
                getStorageKey(selectedLanguage)
              );

              if (savedCode) {
                setCode(savedCode);
              } else {
                setCode(templates[selectedLanguage]);
              }
            }}
            className="
h-12
rounded-xl
border
border-slate-700
bg-slate-800
text-white
px-4
mb-5
focus:border-cyan-500
outline-none
transition
"
          >
            <option value="python">Python</option>
            <option value="cpp">C++</option>
            <option value="c">C</option>
            <option value="java">Java</option>
          </select>

    <div className="flex-1 rounded-xl overflow-hidden border border-slate-700">
    <Editor
            height="100%"
            language={language}
            theme="vs-dark"
            value={code}
            onChange={(value) => {
              const newCode = value || "";

              setCode(newCode);

              localStorage.setItem(
                getStorageKey(language),
                newCode
              );
            }}
            options={{
              fontSize: 15,
              fontFamily: "'JetBrains Mono', monospace",
              minimap: { enabled: false },
              automaticLayout: true,
              wordWrap: "on",
              tabSize: 4,
            }}
          />
       </div>
        </div>

      </div>

 <div className="grid grid-cols-2 gap-6 mt-6">

  {/* Custom Input */}

  <div className="
bg-slate-900/70
border
border-slate-700
rounded-2xl
backdrop-blur-xl
p-6
">

    <h2 className="text-xl font-bold text-cyan-400 mb-4">
      Custom Input
    </h2>

    <textarea
      rows="8"
      value={customInput}
      onChange={(e) => setCustomInput(e.target.value)}
      className="
w-full
h-52
rounded-xl
border
border-slate-700
bg-slate-800
text-white
placeholder:text-slate-500
p-4
focus:border-cyan-500
outline-none
resize-none
"
      placeholder="Enter custom input..."
    />

  </div>

  {/* Output */}

  <div className="
bg-slate-900/70
border
border-slate-700
rounded-2xl
backdrop-blur-xl
p-6
">

    <h2 className="text-lg font-semibold mb-3">
      Output
    </h2>

    <div
  className={`
rounded-xl
border-2
p-5
min-h-[220px]
bg-[#0F172A]
font-mono
${getVerdictColor()}
`}
>
  {output ? (
    <>
      <h3 className="text-2xl font-bold mb-4">
        {output.split("\n")[0]}
      </h3>

      <pre className="whitespace-pre-wrap">
        {output.split("\n").slice(1).join("\n")}
      </pre>
    </>
  ) : (
    <p className="text-slate-500">
      Run your code to see the output...
    </p>
  )}
</div>

  </div>

</div>

{submissionResult && (
  <div className="
bg-slate-900/70
border
border-cyan-500
rounded-2xl
backdrop-blur-xl
p-8
mt-8
">

    <h2 className="text-3xl font-black mb-6">
      Submission Result
    </h2>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

      <div>
        <p className="text-slate-400">Verdict</p>
        <p
          className={`font-bold text-xl ${
            submissionResult.verdict === "Accepted"
              ? "text-green-400"
              : "text-red-400"
          }`}
        >
          {submissionResult.verdict}
        </p>
      </div>

      <div>
        <p className="text-gray-500">Execution Time</p>
        <p className="font-bold">
          {submissionResult.executionTime} ms
        </p>
      </div>

      <div>
        <p className="text-gray-500">Language</p>
        <p className="font-bold">
          {submissionResult.language.toUpperCase()}
        </p>
      </div>

      <div>
        <p className="text-gray-500">Submitted At</p>
        <p className="font-bold">
          {new Date(submissionResult.createdAt).toLocaleString()}
        </p>
      </div>

    </div>

  </div>
)}

<div className="flex justify-end gap-4 mt-6">

  <button
    disabled={running}
    onClick={runCode}
    className={`px-8 py-3 rounded-xl font-semibold text-white transition-all duration-300 ${
  running
    ? "bg-gray-500 cursor-not-allowed"
    : "bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-105 hover:shadow-[0_8px_25px_rgba(34,197,94,.35)]"
}`}
  >
    {running ? "Running..." : "Run Code"}
  </button>

<button
    disabled={submitting}
    onClick={submitCode}
    className={`px-8 py-3 rounded-xl font-semibold text-white transition-all duration-300 ${
    submitting
    ? "bg-gray-500 cursor-not-allowed"
    : "bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:scale-105 hover:shadow-[0_8px_25px_rgba(34,211,238,.35)]"
}`}
  >
    {submitting ? "Submitting..." : "Submit Code"}
  </button>

  <button
  disabled={reviewing}
  onClick={reviewCode}
  className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-white transition-all duration-300 ${
    reviewing
      ? "bg-gray-500 cursor-not-allowed"
      : "bg-gradient-to-r from-purple-500 to-pink-600 hover:scale-105 hover:shadow-[0_8px_25px_rgba(168,85,247,.35)]"
  }`}
>
  <FaRobot className="text-lg" />
  {reviewing ? "Reviewing..." : "AI Review"}
</button>

  


</div>
{review && (
  <div
    className="
    bg-slate-900/70
    border
    border-purple-500
    backdrop-blur-xl
    rounded-2xl
    mt-8
    p-8
    "
  >

    <h2 className="text-3xl font-black text-purple-400 mb-6">
      🤖 AI Code Review
    </h2>

    <div
      className="
      prose
      prose-invert
      max-w-none
      prose-headings:text-cyan-400
      prose-strong:text-white
      prose-p:text-slate-300
      prose-code:text-green-400
      prose-pre:bg-[#0F172A]
      prose-pre:border
      prose-pre:border-slate-700
      "
    >
      <ReactMarkdown>{review}</ReactMarkdown>
    </div>

  </div>
)}
</div>
</div>
    
  </>
);
}

export default ProblemDetails;