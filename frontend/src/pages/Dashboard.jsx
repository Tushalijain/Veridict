import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Dashboard() {
  const [problems, setProblems] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const problemRes = await api.get("/problems");
      const submissionRes = await api.get("/submissions");

      setProblems(problemRes.data);
      setSubmissions(submissionRes.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const accepted = submissions.filter(
    (sub) => sub.verdict === "Accepted"
  ).length;

  const accuracy =
    submissions.length > 0
      ? ((accepted / submissions.length) * 100).toFixed(2)
      : 0;

if (loading) {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex justify-center items-center">
        <h1 className="text-2xl font-semibold text-gray-500">
          Loading Dashboard...
        </h1>
      </div>
    </>
  );
}

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-4xl font-bold mb-2">
          Welcome, {user?.name} 👋
        </h1>

        

        <p className="text-gray-600 mb-8">
          {user?.email}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          <div className="bg-blue-100 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold">Problems</h2>
            <p className="text-3xl font-bold mt-3">
              {problems.length}
            </p>
          </div>

          <div className="bg-purple-100 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold">Submissions</h2>
            <p className="text-3xl font-bold mt-3">
              {submissions.length}
            </p>
          </div>

          <div className="bg-green-100 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold">Accepted</h2>
            <p className="text-3xl font-bold mt-3">
              {accepted}
            </p>
          </div>

          <div className="bg-yellow-100 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold">Accuracy</h2>
            <p className="text-3xl font-bold mt-3">
              {accuracy}%
            </p>
          </div>

        </div>

        <div className="mt-8 flex gap-4">
          <Link
            to="/problems"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Solve Problems
          </Link>

          <Link
            to="/submissions"
            className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
          >
            Submission History
          </Link>
        </div>
        <div className="mt-10 bg-white rounded-lg shadow p-6">

  <h2 className="text-2xl font-bold mb-5">
    Recent Activity
  </h2>

  {submissions.length === 0 ? (
    <p className="text-gray-500">
      No submissions yet.
    </p>
  ) : (
    <div className="space-y-4">

      {submissions.sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)).slice(0,5).map((submission) => (
        <div
          key={submission._id}
          className="flex justify-between items-center border-b pb-3"
        >

          <div>
            <h3 className="font-semibold">
              {submission.problem?.title || "Problem"}
            </h3>

            <p className="text-sm text-gray-500">
              {submission.language.toUpperCase()}
            </p>
          </div>

          <span
            className={`font-semibold ${
              submission.verdict === "Accepted"
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {submission.verdict}
          </span>

        </div>
      ))}

    </div>
  )}

</div>
      </div>
    </>
  );
}

export default Dashboard;