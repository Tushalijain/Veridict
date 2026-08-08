import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";


function ContestArena() {

    const { id } = useParams();
    // console.log("Contest ID:", id);
    const [timeLeft, setTimeLeft] = useState("");
    const [contest, setContest] = useState(null);
    
    const [leaderboard, setLeaderboard] = useState([]);
    useEffect(() => {
        fetchContest();
    }, []);
    useEffect(() => {

  if (!contest) return;

  const interval = setInterval(() => {

    const now = new Date();

    let target;

    if (contest.status === "Upcoming") {

      target = new Date(contest.startTime);

      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft("Starting...");
        return;
      }

    } else if (contest.status === "Running") {

      target = new Date(contest.endTime);

      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft("Contest Ended");
        return;
      }

    } else {

      setTimeLeft("Contest Finished");
      return;

    }

    const distance = target - now;

    const hours = Math.floor(distance / (1000 * 60 * 60));

    const minutes = Math.floor(
      (distance % (1000 * 60 * 60)) / (1000 * 60)
    );

    const seconds = Math.floor(
      (distance % (1000 * 60)) / 1000
    );

    setTimeLeft(
      `${hours}h ${minutes}m ${seconds}s`
    );

  }, 1000);

  return () => clearInterval(interval);

}, [contest]);

   const fetchContest = async () => {
  try {
    const response = await api.get(`/contests/${id}`);
    const contestData = response.data.contest;

    setContest(contestData);

    // Fetch leaderboard only if contest has started or ended
    if (
      contestData.status === "Running" ||
      contestData.status === "Ended"
    ) {
     const board = await api.get(`/contest-leaderboard/${id}`);

console.log("Leaderboard Response:", board.data);

setLeaderboard(board.data);
    }

  } catch (err) {
    console.log(err);
  }
};

    if (!contest)
        return <h2 className="p-8">Loading...</h2>;

    console.log("Contest:", contest);
console.log("Contest _id:", contest?._id);
    return (
  <>
    

    <div className="min-h-screen bg-[#0f172a] text-white p-10">

      {/* Contest Header */}

      <div className="mb-10">
        <h1 className="text-5xl font-bold">
          🏆 {contest.title}
        </h1>

        <p className="text-slate-400 mt-3 text-lg">
          {contest.description}
        </p>
      </div>

      {/* Contest Stats */}

      <div className="grid grid-cols-1 md:grid-cols-5 gap-5 mb-12">

        <div className="bg-slate-800 rounded-2xl p-5">
          <p className="text-slate-400">Status</p>

          <p
            className={`text-2xl font-bold ${
              contest.status === "Running"
                ? "text-green-400"
                : contest.status === "Upcoming"
                ? "text-yellow-400"
                : "text-red-400"
            }`}
          >
            {contest.status}
          </p>
        </div>

        <div className="bg-slate-800 rounded-2xl p-5">
          <p className="text-slate-400">Problems</p>

          <p className="text-cyan-400 text-2xl font-bold">
            {contest.problems.length}
          </p>
        </div>

        <div className="bg-slate-800 rounded-2xl p-5">
          <p className="text-slate-400">Duration</p>

          <p className="text-purple-400 text-2xl font-bold">
            {contest.duration} min
          </p>
        </div>

        <div className="bg-slate-800 rounded-2xl p-5">
          <p className="text-slate-400">Participants</p>

          <p className="text-orange-400 text-2xl font-bold">
            {contest.registeredUsers?.length || 0}
          </p>
        </div>
        <div className="bg-slate-800 rounded-2xl p-5">

  <p className="text-slate-400">
    Countdown
  </p>

  <p className="text-pink-400 text-2xl font-bold">
    {timeLeft}
  </p>

</div>

      </div>

      {/* Leaderboard */}

      <div className="mb-14">

       {contest.status === "Running" ? (
  <div className="bg-green-500/10 border border-green-500 rounded-2xl p-5 mb-6">
    <h2 className="text-3xl font-bold text-green-400">
      📊 Live Leaderboard
    </h2>

    <p className="text-slate-400 mt-2">
      Rankings update automatically.
    </p>
  </div>
) : contest.status === "Ended" ? (
  <div className="bg-red-500/10 border border-red-500 rounded-2xl p-5 mb-6">
    <h2 className="text-3xl font-bold text-red-400">
      🏆 Final Leaderboard
    </h2>

    <p className="text-slate-400 mt-2">
      Contest has ended.
    </p>
  </div>
) : null}

       {contest.status === "Ended" && (
  <div className="mt-14">
    {/* Leaderboard Table */}
  </div>
)}

        {contest.status === "Upcoming" && (
  <div className="mt-10 bg-yellow-500/10 border border-yellow-500 rounded-2xl p-6">
    <h2 className="text-3xl font-bold text-yellow-400">
      ⏳ Contest Not Started
    </h2>

    <p className="text-slate-400 mt-2">
      The contest hasn't started yet.
    </p>
  </div>
)}

        {(contest.status === "Running" ||
  contest.status === "Ended") && (
          <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">

            <table className="w-full">

              <thead className="bg-slate-900">

                <tr>
                  <th className="py-4">Rank</th>
                  <th className="text-left">User</th>
                  <th>Solved</th>
                  <th>Score</th>
                </tr>

              </thead>

              <tbody>

                {leaderboard.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center py-8 text-slate-400"
                    >
                      No submissions yet.
                    </td>
                  </tr>
                ) : (
                  leaderboard.map((user, index) => (
                    <tr
                      key={user._id}
                      className="border-t border-slate-700 hover:bg-slate-700/30"
                    >
                      <td className="text-center py-5 font-bold">
                        {index === 0
                          ? "🥇"
                          : index === 1
                          ? "🥈"
                          : index === 2
                          ? "🥉"
                          : index + 1}
                      </td>

                      <td className="font-semibold">
                        {user.name}
                      </td>

                      <td className="text-center">
                        {user.solved}
                      </td>

                      <td className="text-center text-cyan-400 font-bold">
                        {user.points}
                      </td>
                    </tr>
                  ))
                )}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {/* Problems */}

{contest.status !== "Upcoming" && (
  <div className="mt-8">

    <h2 className="text-3xl font-bold mb-6">
      Problems
    </h2>

    <div className="space-y-4">

      {contest.problems.map((problem, index) => (

        <div
          key={problem._id}
          className="
            bg-slate-800/60
            border
            border-slate-700
            rounded-2xl
            p-6
            flex
            justify-between
            items-center
            hover:border-cyan-500
            hover:scale-[1.01]
            transition-all
          "
        >

          <div>

            <h3 className="text-2xl font-bold">
  {String.fromCharCode(65 + index)}. {problem.title}
</h3>

            <span
              className={`inline-block mt-3 px-4 py-1 rounded-full text-sm font-semibold ${
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

         {contest.status === "Running" ? (
 <Link
  to={`/problems/${problem._id}?contest=${contest._id}`}
  onClick={() => alert(`/problems/${problem._id}?contest=${contest._id}`)}
>
  Solve →
</Link>
) : contest.status === "Ended" ? (
  <Link to={`/problems/${problem._id}`}>
    Practice →
  </Link>
) : (
  <button disabled>Not Started</button>
)}
 
        </div>

      ))}

    </div>

  </div>
)}

    </div>

  </>
);
}

export default ContestArena;