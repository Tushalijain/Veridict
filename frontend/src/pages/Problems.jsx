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
    <div className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-4xl font-bold mb-8">
        Problems
      </h1>

     <div className="flex flex-col md:flex-row gap-4 mb-6">

  <input
    type="text"
    placeholder="🔍 Search problems..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-full md:w-96 p-3 border rounded-lg shadow-sm"
  />

  <select
    value={difficulty}
    onChange={(e) => setDifficulty(e.target.value)}
    className="p-3 border rounded-lg shadow-sm"
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
            className="bg-white shadow rounded-lg p-6 flex justify-between items-center"
          >

            <div>
              <h2 className="text-xl font-semibold">
                {problem.title}
              </h2>

              <p className="text-gray-500">
                {problem.difficulty}
              </p>
            </div>

            <Link
              to={`/problems/${problem._id}`}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Solve
            </Link>

          </div>

        ))}

      </div>

    </div>
    </>
  );

  

  
}

export default Problems;