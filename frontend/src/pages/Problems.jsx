import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

function Problems() {
  const [problems, setProblems] = useState([]);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const response = await api.get("/problems");
      setProblems(response.data);
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
    Problems
  </h1>

  <p className="text-slate-400 mt-3">
    Sharpen your skills by solving coding challenges.
  </p>

</div>

     <div className="flex flex-col md:flex-row gap-4 mb-6">

  <input
    type="text"
    placeholder="🔍 Search problems..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="
w-full
md:w-[420px]
h-12
rounded-xl
border
border-slate-700
bg-slate-900/70
backdrop-blur-xl
px-5
text-white
placeholder:text-slate-500
focus:border-cyan-500
outline-none
transition
"
  />

  <select
    value={difficulty}
    onChange={(e) => setDifficulty(e.target.value)}
    className="
h-12
rounded-xl
border
border-slate-700
bg-slate-900/70
backdrop-blur-xl
px-4
text-white
focus:border-cyan-500
outline-none
transition
"
  >
    <option value="All">All</option>
    <option value="Easy">Easy</option>
    <option value="Medium">Medium</option>
    <option value="Hard">Hard</option>
  </select>

</div>

      <div className="space-y-4">

        {problems.filter((problem) => problem.title.toLowerCase().includes(search.toLowerCase())).filter((problem) =>
    difficulty === "All" || problem.difficulty === difficulty
  ).map((problem) => (

          <div
            key={problem._id}
            className="
bg-slate-900/70
border
border-slate-700
rounded-2xl
backdrop-blur-xl
p-6
flex
justify-between
items-center
hover:border-cyan-500
hover:scale-[1.01]
transition-all
duration-300
"
          >

            <div>
              <h2 className="text-xl font-bold">
                {problem.title}
              </h2>

              <span
  className={`inline-block mt-3 px-3 py-1 rounded-full text-sm font-semibold
  ${
    problem.difficulty === "Easy"
      ? "bg-green-500/20 text-green-400"
      : problem.difficulty === "Medium"
      ? "bg-yellow-500/20 text-yellow-400"
      : "bg-red-500/20 text-red-400"
  }`}
>
  {problem.difficulty}
</span>
            </div>

            <Link
              to={`/problems/${problem._id}`}
              className="
bg-gradient-to-r
from-cyan-500
via-blue-500
to-purple-600
text-white
px-6
py-2
rounded-xl
font-semibold
hover:scale-105
hover:shadow-[0_8px_25px_rgba(34,211,238,.35)]
transition-all
duration-300
"
            >
              Solve
            </Link>

          </div>

        ))}

      </div>

    </div>
    </div>
    </>
  );
}

export default Problems;