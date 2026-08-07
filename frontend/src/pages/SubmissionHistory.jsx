import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

function SubmissionHistory() {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await api.get("/submissions");
       console.log(response.data);
      setSubmissions(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
     <Navbar />
    <div className="min-h-screen bg-[#050816] text-white">
  <div className="max-w-7xl mx-auto px-8 lg:px-20 py-12">

      <div className="mb-10">

  <h1 className="text-5xl font-black">
    Submission History
  </h1>

  <p className="text-slate-400 mt-3">
    Review all your submissions and track your progress.
  </p>

</div>

     <div className="bg-slate-900/70 border border-slate-700 rounded-2xl backdrop-blur-xl overflow-hidden">

  {submissions.length === 0 ? (

    <div className="py-20 text-center">

      <h2 className="text-2xl font-bold text-white mb-3">
        No submissions yet
      </h2>

      <p className="text-slate-400">
        Solve your first problem to see your submission history.
      </p>

    </div>

  ) : (

    <table className="w-full">

     <thead className="bg-slate-900 border-b border-slate-700">

            <tr>

              <th className="
px-6
py-4
text-left
text-slate-400
uppercase
tracking-wider
text-sm
font-semibold
">Problem</th>

              <th className="
px-6
py-4
text-left
text-slate-400
uppercase
tracking-wider
text-sm
font-semibold
">Language</th>

              <th className="
px-6
py-4
text-left
text-slate-400
uppercase
tracking-wider
text-sm
font-semibold
">Verdict</th>

              <th className="
px-6
py-4
text-left
text-slate-400
uppercase
tracking-wider
text-sm
font-semibold
">Execution Time</th>

              <th className="
px-6
py-4
text-left
text-slate-400
uppercase
tracking-wider
text-sm
font-semibold
">Submitted At</th>

            </tr>

          </thead>

          <tbody>

            {submissions.map((submission) => {
  console.log("Rendering:", submission);

  return (

              <tr
                key={submission._id}
                className="
border-b
border-slate-700
hover:bg-slate-800/60
transition
"
              >

                <td className="px-6 py-5">
                  {submission.problem?.title || "Unknown"}
                </td>

                <td className="px-6 py-5">
                 <span className="font-semibold text-cyan-400">
  {submission.language === "cpp"
    ? "C++"
    : submission.language === "c"
    ? "C"
    : submission.language === "python"
    ? "Python"
    : submission.language === "java"
    ? "Java"
    : submission.language}
</span>
                </td>

                <td className="px-6 py-5">
                <span
  className={`px-3 py-1 rounded-full text-sm font-semibold ${
    submission.verdict === "Accepted"
      ? "bg-green-500/20 text-green-400"
      : submission.verdict === "Wrong Answer"
      ? "bg-red-500/20 text-red-400"
      : submission.verdict === "Compilation Error"
      ? "bg-yellow-500/20 text-yellow-400"
      : submission.verdict === "Runtime Error"
      ? "bg-orange-500/20 text-orange-400"
      : "bg-slate-700 text-slate-300"
  }`}
>
  {submission.verdict}
</span>
              </td>

                <td className="px-6 py-5">
                  <span className="text-purple-400 font-medium">
  {submission.executionTime} ms
</span>
                </td>

                <td className="px-6 py-5">
                  <span className="text-slate-400">
  {new Date(submission.createdAt).toLocaleString()}
</span>
                </td>

              </tr>

            );
})}

          </tbody>

    </table>

  )}

</div>
</div>
    </div>
  </>
  );
}

export default SubmissionHistory;