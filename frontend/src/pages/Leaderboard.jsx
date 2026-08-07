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

      <div className="min-h-screen bg-[#050816] text-white">
        <div className="max-w-7xl mx-auto px-8 lg:px-20 py-12">

        <div className="text-center mb-12">

    <h1 className="text-5xl font-black">
        🏆 Global Leaderboard
    </h1>

    <p className="text-slate-400 mt-4 text-lg">
        Top 10 Programmers
    </p>

</div>

        <div
className="
bg-slate-900/70
border
border-slate-700
rounded-2xl
backdrop-blur-xl
overflow-hidden
">

          <table className="w-full">

            <thead className="bg-slate-900 border-b border-slate-700">

              <tr>
                <th className="
px-6
py-4
text-slate-400
uppercase
tracking-wider
text-sm
font-semibold
">Rank</th>
                <th className="p-4 text-left">User</th>
                <th className="
px-6
py-4
text-slate-400
uppercase
tracking-wider
text-sm
font-semibold
">Solved</th>
                <th className="
px-6
py-4
text-slate-400
uppercase
tracking-wider
text-sm
font-semibold
">Submissions</th>
                <th className="
px-6
py-4
text-slate-400
uppercase
tracking-wider
text-sm
font-semibold
">Points</th>
              
              </tr>

            </thead>

            <tbody>

              {leaders.map((user, index) => (

                <tr
                    key={user._id}
                    className={`border-b border-slate-700 transition-all duration-300
                        ${
                        currentUser?._id === user.user._id
                        ? "bg-cyan-500/10 border-cyan-500"
                        : index === 0
                        ? "bg-yellow-500/10"
                        : index === 1
                        ? "bg-slate-500/10"
                        : index === 2
                        ? "bg-orange-500/10"
                        : "hover:bg-slate-800/60"
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

                  <td className="
px-6
py-4
text-slate-400
uppercase
tracking-wider
text-sm
font-semibold
">
                    <div className="font-bold text-lg text-white">
                      {user.user.name}
                    </div>

                    <div className="text-sm text-slate-400">
                      {user.user.email}
                    </div>
                  </td>

                 <td className="px-6 py-5 text-center font-bold text-green-400">
                    {user.solved}
                </td>

                 <td className="px-6 py-5 text-center text-slate-300">
                    {user.totalSubmissions}
                 </td>

                  <td className="p-4 text-center">
                    <span
className="
bg-gradient-to-r
from-cyan-500
to-purple-600
text-white
px-4
py-1.5
rounded-full
font-bold
shadow-lg
">
                        ⭐ {user.points} pts
                    </span>
                  </td>

                

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>
</div>
    </>
  );
}

export default Leaderboard;