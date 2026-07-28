import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await api.get("/leaderboard");
      setLeaders(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 p-8">

        <div className="text-center mb-8">
            <h1 className="text-4xl font-bold">
                🏆 Global Leaderboard
            </h1>

            <p className="text-gray-500 mt-2">
                Top 10 Programmers
            </p>
         </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">

          <table className="w-full divide-y divide-gray-200">

            <thead className="bg-gray-200">

              <tr>
                <th className="p-4">Rank</th>
                <th className="p-4 text-left">User</th>
                <th className="p-4">Solved</th>
                <th className="p-4">Submissions</th>
                <th className="p-4">Points</th>
                <th className="p-4">Accuracy</th>
              </tr>

            </thead>

            <tbody>

              {leaders.map((user, index) => (

                <tr
                    key={user._id}
                    className={`border-t transition ${
                        currentUser?._id === user.user._id
                        ? "bg-blue-100"
                        : index === 0
                        ? "bg-yellow-100"
                        : index === 1
                        ? "bg-gray-100"
                        : index === 2
                        ? "bg-orange-100"
                        : "hover:bg-gray-50"
                    }`}
                 >

                  <td className="p-4 text-center text-2xl font-bold">
                    {index === 0 ? (
                        "🥇"
                    ) : index === 1 ? (
                        "🥈"
                    ) : index === 2 ? (
                        "🥉"
                    ) : (
                        index + 1
                    )}
                  </td>

                  <td className="p-4">
                    <div className="font-bold text-lg">
                      {user.user.name}
                    </div>

                    <div className="text-sm text-gray-500">
                      {user.user.email}
                    </div>
                  </td>

                 <td className="p-4 text-center font-bold text-green-600">
                    {user.solved}
                </td>

                  

                 <td className="p-4 text-center text-gray-700">
                    {user.totalSubmissions}
                 </td>

                  <td className="p-4 text-center">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full font-bold">
                        ⭐ {user.points} pts
                    </span>
                  </td>
                 

                  <td
                    className={`p-4 text-center font-bold ${
                        user.accuracy >= 80
                        ? "text-green-600"
                        : user.accuracy >= 50
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                    >
                    {user.accuracy}%
                 </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </>
  );
}

export default Leaderboard;