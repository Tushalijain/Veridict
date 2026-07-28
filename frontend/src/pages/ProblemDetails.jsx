import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Editor from "@monaco-editor/react";
import ReactMarkdown from "react-markdown";

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
      "http://localhost:5000/api/compiler/run",
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
    setOutput(error.response?.data?.message || "Submission Failed");
  } finally {
    setSubmitting(false);
  }
};

const reviewCode = async () => {
  try {
    setReviewing(true);
    setReview("🤖 Reviewing your code...");

    const response = await api.post("/review", {
      language,
      code,
    });

    if (response.data.success) {
      setReview(response.data.review);
    } else {
      setReview("Unable to review code.");
    }
  } catch (error) {
    console.error(error);
    setReview("AI Review Failed.");
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
    <Navbar />

    <div className="min-h-screen bg-gray-100 p-6">

      <div className="grid grid-cols-2 gap-6">

        {/* LEFT PANEL */}
        <div className="bg-white rounded-lg shadow p-6 h-[85vh] overflow-y-auto">

          <h1 className="text-4xl font-bold mb-6">
            {problem.title}
          </h1>

          <h2 className="text-xl font-semibold mb-2">
            Problem Statement
          </h2>

          <p className="mb-6">
            {problem.statement}
          </p>

          <h2 className="text-xl font-semibold mb-2">
  Difficulty
</h2>

<span
  className={`inline-block px-4 py-2 rounded-full font-semibold mb-6 ${getDifficultyColor()}`}
>
  {problem.difficulty}
</span>

          <h2 className="text-xl font-semibold mb-2">
            Constraints
          </h2>

          <p>
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
        selectedExample === index
          ? "bg-blue-600 text-white"
          : "bg-gray-200 hover:bg-gray-300"
      }`}
    >
      Example {index + 1}
    </button>
  ))}
</div>

<div className="border rounded-lg p-4 bg-gray-50">

  <h3 className="font-semibold">Input</h3>

  <pre className="bg-gray-200 rounded-lg p-3 mt-2 whitespace-pre-wrap">
    {example?.input}
  </pre>

  <h3 className="font-semibold mt-4">Output</h3>

  <pre className="bg-gray-200 rounded-lg p-3 mt-2 whitespace-pre-wrap">
    {example?.output}
  </pre>

  <h3 className="font-semibold mt-4">Explanation</h3>

  <p className="mt-2">
    {example?.explanation}
  </p>

</div>

        </div>

        {/* RIGHT PANEL */}

        <div className="bg-white rounded-lg shadow p-6 flex flex-col h-[85vh]">

          <label className="font-semibold mb-2">
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
            className="border rounded-lg p-2 mb-4"
          >
            <option value="python">Python</option>
            <option value="cpp">C++</option>
            <option value="c">C</option>
            <option value="java">Java</option>
          </select>

          <Editor
            height="450px"
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
              fontSize: 16,
              minimap: { enabled: false },
              automaticLayout: true,
              wordWrap: "on",
              tabSize: 4,
            }}
          />

        </div>

      </div>

     

 <div className="grid grid-cols-2 gap-6 mt-6">

  {/* Custom Input */}

  <div className="bg-white rounded-lg shadow p-4">

    <h2 className="text-lg font-semibold mb-3">
      Custom Input
    </h2>

    <textarea
      rows="8"
      value={customInput}
      onChange={(e) => setCustomInput(e.target.value)}
      className="w-full border rounded-lg p-3"
      placeholder="Enter custom input..."
    />

  </div>

  {/* Output */}

  <div className="bg-white rounded-lg shadow p-4">

    <h2 className="text-lg font-semibold mb-3">
      Output
    </h2>

    <div
  className={`rounded-lg border-2 p-5 min-h-[180px] ${getVerdictColor()}`}
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
    <p className="text-gray-500">
      Run your code to see the output...
    </p>
  )}
</div>

  </div>

</div>

{submissionResult && (
  <div className="bg-white shadow-lg rounded-xl p-6 mt-6 border-l-4 border-blue-600">

    <h2 className="text-2xl font-bold mb-4">
      Submission Result
    </h2>

    <div className="grid grid-cols-2 gap-6">

      <div>
        <p className="text-gray-500">Verdict</p>
        <p
          className={`font-bold text-xl ${
            submissionResult.verdict === "Accepted"
              ? "text-green-600"
              : "text-red-600"
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
    className={`px-8 py-3 rounded-lg text-white transition ${
      running
        ? "bg-gray-500 cursor-not-allowed"
        : "bg-green-600 hover:bg-green-700"
    }`}
  >
    {running ? "Running..." : "Run Code"}
  </button>

  <button
  disabled={reviewing}
  onClick={reviewCode}
  className={`px-8 py-3 rounded-lg text-white transition ${
    reviewing
      ? "bg-gray-500 cursor-not-allowed"
      : "bg-purple-600 hover:bg-purple-700"
  }`}
>
  {reviewing ? "Reviewing..." : "AI Review"}
</button>

  <button
    disabled={submitting}
    onClick={submitCode}
    className={`px-8 py-3 rounded-lg text-white transition ${
      submitting
        ? "bg-gray-500 cursor-not-allowed"
        : "bg-blue-600 hover:bg-blue-700"
    }`}
  >
    {submitting ? "Submitting..." : "Submit Code"}
  </button>

  

</div>
{review && (
  <div className="bg-white rounded-xl shadow-lg mt-8 p-6">

    <h2 className="text-2xl font-bold mb-4 text-purple-700">
      🤖 AI Code Review
    </h2>

    <div className="prose max-w-none">
      <ReactMarkdown>{review}</ReactMarkdown>
    </div>

  </div>
)}


</div>
    
  </>
);

  
  
}

export default ProblemDetails;