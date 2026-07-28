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
    <div className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-4xl font-bold mb-8">
        Submission History
      </h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-200">

            <tr>

              <th className="p-4 text-left">Problem</th>

              <th className="p-4 text-left">Language</th>

              <th className="p-4 text-left">Verdict</th>

              <th className="p-4 text-left">Execution Time</th>

              <th className="p-4 text-left">Submitted At</th>

            </tr>

          </thead>

          <tbody>

            {submissions.map((submission) => {
  console.log("Rendering:", submission);

  return (

              <tr
                key={submission._id}
                className="border-t"
              >

                <td className="p-4">
                  {submission.problem?.title || "Unknown"}
                </td>

                <td className="p-4">
                  {submission.language}
                </td>

                <td className="p-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    submission.verdict === "Accepted"
                      ? "bg-green-100 text-green-700"
                      : submission.verdict === "Wrong Answer"
                      ? "bg-red-100 text-red-700"
                      : submission.verdict === "Compilation Error"
                      ? "bg-yellow-100 text-yellow-700"
                      : submission.verdict === "Runtime Error"
                      ? "bg-orange-100 text-orange-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {submission.verdict}
                </span>
              </td>

                <td className="p-4">
                  {submission.executionTime} ms
                </td>

                <td className="p-4">
                  {new Date(submission.createdAt).toLocaleString()}
                </td>

              </tr>

            );
})}

          </tbody>

        </table>

      </div>

    </div>
  </>
  );

  

  
}

export default SubmissionHistory;