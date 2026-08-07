import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get(`/dashboard/${user._id}`);
      setDashboard(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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

  if (!dashboard) return null;

  const { stats, difficulty, recentSubmissions } = dashboard;

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-transparent px-10 py-10 max-w-7xl mx-auto">

        <div className="mb-10">
   <p className="text-white mt-2 mb-8 text-xl">
     Welcome back! Here's your coding progress.
</p>

    <p className="text-slate-400 mt-2">
        Ready to solve today's problems?
    </p>
</div>


        {/* Stats */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

          <div className="
bg-slate-900/70
border
border-slate-700
rounded-2xl
p-6
backdrop-blur-xl

">
            <h2 className="text-slate-400 text-sm uppercase tracking-wide font-semibold">
              Problems
            </h2>

            <p className="text-4xl font-bold text-white mt-2">
              {stats.totalProblems}
            </p>
          </div>

          <div className="
bg-slate-900/70
border
border-slate-700
rounded-2xl
p-6
backdrop-blur-xl

">
            <h2 className="text-slate-400 text-sm uppercase tracking-wide font-semibold">
              Submissions
            </h2>

            <p className="text-4xl font-bold text-white mt-2">
              {stats.totalSubmissions}
            </p>
          </div>

          <div className="
bg-slate-900/70
border
border-slate-700
rounded-2xl
p-6
backdrop-blur-xl

">
            <h2 className="text-slate-400 text-sm uppercase tracking-wide font-semibold">
              Accepted
            </h2>

            <p className="text-4xl font-bold text-white mt-2">
              {stats.accepted}
            </p>
          </div>

          <div className="
bg-slate-900/70
border
border-slate-700
rounded-2xl
p-6
backdrop-blur-xl

">
            <h2 className="text-slate-400 text-sm uppercase tracking-wide font-semibold">
              Accuracy
            </h2>

            <p className="text-4xl font-bold text-white mt-2">
              {stats.accuracy}%
            </p>
          </div>

        </div>

        {/* Recent Activity */}

        <div className="
bg-slate-900/70
border
border-slate-700
rounded-2xl
p-6
backdrop-blur-xl

">

          <h2 className="text-2xl font-bold mb-5">
            Recent Activity
          </h2>

          {recentSubmissions.length === 0 ? (

            <p className="text-gray-500">
              No submissions yet.
            </p>

          ) : (

            <div className="space-y-4">

              {recentSubmissions.map((submission) => (

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

        {/* Problem Progress */}
<div className="mt-8">
        <div className="
bg-slate-900/70
border
border-slate-700
rounded-2xl
p-6
backdrop-blur-xl

">

          <h2 className="text-2xl font-bold text-white mb-6">
  Problem Progress
</h2>

          <div className="space-y-6">

            {/* Easy */}

            <div>

              <div className="flex justify-between mb-2">

                <span className="font-medium text-green-600">
                  Easy
                </span>

                <span className="text-slate-300 text-sm">
  {difficulty.easy.solved}/{difficulty.easy.total}
</span>

              </div>

              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">

                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      difficulty.easy.total
                        ? (difficulty.easy.solved /
                            difficulty.easy.total) *
                          100
                        : 0
                    }%`,
                  }}
                ></div>

              </div>

            </div>

            {/* Medium */}

            <div>

              <div className="flex justify-between mb-2">

                <span className="font-medium text-yellow-600">
                  Medium
                </span>

                <span className="text-slate-300 text-sm">
  {difficulty.medium.solved}/{difficulty.medium.total}
</span>

              </div>

              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">

                <div
                  className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      difficulty.medium.total
                        ? (difficulty.medium.solved /
                            difficulty.medium.total) *
                          100
                        : 0
                    }%`,
                  }}
                ></div>

              </div>

            </div>

            {/* Hard */}

            <div>

              <div className="flex justify-between mb-2">

                <span className="font-medium text-red-600">
                  Hard
                </span>

                <span className="text-slate-300 text-sm">
  {difficulty.hard.solved}/{difficulty.hard.total}
</span>

              </div>

              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">

                <div
                  className="bg-red-500 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      difficulty.hard.total
                        ? (difficulty.hard.solved /
                            difficulty.hard.total) *
                          100
                        : 0
                    }%`,
                  }}
                ></div>

              </div>

            </div>

          </div>

        </div>
</div>
      </div>

    </>
  );
}

export default Dashboard;