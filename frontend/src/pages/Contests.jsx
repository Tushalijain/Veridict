import { useEffect, useState } from "react";
import api from "../services/api";

import { useNavigate } from "react-router-dom";

function Contests() {
  const [contests, setContests] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    fetchContests();
  }, []);

  useEffect(() => {
  const timer = setInterval(() => {
    setCurrentTime(new Date());
  }, 1000);

  return () => clearInterval(timer);
}, []);

  const fetchContests = async () => {
    try {
      const response = await api.get("/contests");
      setContests(response.data.contests);
    } catch (error) {
      console.error(error);
    }
  };

  const registerContest = async (contestId) => {
    try {
      await api.post("/contests/register", {
        contestId,
        userId: user._id,
      });

      alert("Successfully Registered!");

      fetchContests();

    } catch (error) {
      alert(error.response?.data?.message);
    }
  };

const getRemainingTime = (targetTime) => {
  const difference =
    new Date(targetTime) - currentTime;

  if (difference <= 0)
    return "00d 00h 00m 00s";

  const days = Math.floor(
    difference / (1000 * 60 * 60 * 24)
  );

  const hours = Math.floor(
    (difference / (1000 * 60 * 60)) % 24
  );

  const minutes = Math.floor(
    (difference / (1000 * 60)) % 60
  );

  const seconds = Math.floor(
    (difference / 1000) % 60
  );

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};
  return (
    <>
      

      <div className="min-h-screen bg-[#0f172a] px-8 py-10 text-white">

       <div className="mb-12">

  <h1 className="text-5xl font-bold text-white">
    🏆 Coding Contests
  </h1>

  <p className="text-slate-400 mt-3 text-lg">
    Compete against programmers around the world.
  </p>

</div>

        <div className="10 max-w-7xl mx-auto">

          {contests.map((contest) => {

              const registered = contest.registeredUsers?.some((u) => (u._id || u).toString() === user._id.toString());

            return (

              <div
                key={contest._id}
               className="
bg-gradient-to-br
from-slate-800
to-slate-900
border
border-slate-700
rounded-3xl
p-8
shadow-xl
hover:shadow-cyan-500/20
hover:border-cyan-500
transition-all
duration-300
"
              >

               <h2 className="text-3xl font-bold text-white">
    {contest.title}
</h2>
<p className="text-slate-500 mt-2">
    👥 {contest.registeredUsers.length} Registered
</p>

<p className="text-slate-400 mt-3 text-lg">
    {contest.description}
</p>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">

  <div className="bg-slate-900 rounded-2xl p-5 text-center border border-cyan-500/20">

    <p className="text-slate-400 text-sm">
      Problems
    </p>

    <p className="text-cyan-400 text-2xl font-bold">
      {contest.problems.length}
    </p>

  </div>

  <div className="bg-slate-900 rounded-2xl p-5 text-center border border-purple-500/20">

    <p className="text-slate-400 text-sm">
      Duration
    </p>

    <p className="text-purple-400 text-2xl font-bold">
      {contest.duration} min
    </p>

  </div>

  <div className="bg-slate-900 rounded-2xl p-5 text-center border border-green-500/20">

    <p className="text-slate-400 text-sm">
      Status
    </p>

    <p
      className={`text-xl font-bold ${
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

</div>

{/* Countdown */}

<div className="flex justify-center mt-7">

  {contest.status === "Upcoming" && (

    <div className="inline-flex items-center gap-2 bg-yellow-500/20 text-yellow-300 px-5 py-2 rounded-full">
      ⏳ Starts In
      <span className="font-bold">
        {getRemainingTime(contest.startTime)}
      </span>
    </div>

  )}

  {contest.status === "Running" && (

    <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-300 px-5 py-2 rounded-full">
      🚀 Ends In
      <span className="font-bold">
        {getRemainingTime(contest.endTime)}
      </span>
    </div>

  )}

  {contest.status === "Ended" && (

    <div className="inline-flex items-center gap-2 bg-red-500/20 text-red-300 px-5 py-2 rounded-full">
      🏁 Contest Finished
    </div>

  )}

</div>

<button
  
 onClick={() => {
  if (contest.status === "Upcoming") {
    registerContest(contest._id);
  }

  if (contest.status === "Running") {
    navigate(`/contest/${contest._id}`);
  }

  if (contest.status === "Ended") {
    navigate(`/contest/${contest._id}`);
}
}}
  className={`
mt-8
w-full
h-14
rounded-xl
font-semibold
text-lg
transition-all
${
  contest.status === "Running"
    ? "bg-green-600 hover:bg-green-700"
    : contest.status === "Upcoming"
    ? registered
      ? "bg-slate-600"
      : "bg-cyan-600 hover:bg-cyan-700"
    : "bg-orange-600 hover:bg-orange-700"
}
`}
>
  {contest.status === "Upcoming"
    ? registered
      ? "✓ Registered"
      : "Register Now"
    : contest.status === "Running"
    ? "🚀 Enter Contest"
    : "🏆 View Results"}
</button>
              </div>
            );
          })}
        </div>
      </div>
      
    </>
  );
}
export default Contests;