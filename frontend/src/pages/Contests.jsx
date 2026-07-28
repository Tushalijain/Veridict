import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
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
      <Navbar />

      <div className="min-h-screen bg-gray-100 p-8">

        <h1 className="text-4xl font-bold mb-8">
          Contests
        </h1>

        <div className="space-y-6">

          {contests.map((contest) => {

              const registered = contest.registeredUsers?.some((u) => (u._id || u).toString() === user._id.toString());

            return (

              <div
                key={contest._id}
                className="bg-white rounded-xl shadow p-6"
              >

                <h2 className="text-2xl font-bold">
                  {contest.title}
                </h2>

                <p className="text-gray-600 mt-2">
                  {contest.description}
                </p>

                <div className="mt-4">

  <p>
    <b>Status:</b>{" "}
    <span
      className={`font-semibold ${
        contest.status === "Upcoming"
          ? "text-yellow-600"
          : contest.status === "Running"
          ? "text-green-600"
          : "text-red-600"
      }`}
    >
      {contest.status}
    </span>
  </p>

  <p>
    <b>Problems:</b> {contest.problems.length}
  </p>

  <p>
    <b>Duration:</b> {contest.duration} Minutes
  </p>

  {/* Countdown Timer */}

  {contest.status === "Upcoming" && (
    <p className="mt-3 text-blue-600 font-semibold">
      Starts In: {getRemainingTime(contest.startTime)}
    </p>
  )}

  {contest.status === "Running" && (
    <p className="mt-3 text-green-600 font-semibold">
      Ends In: {getRemainingTime(contest.endTime)}
    </p>
  )}

  {contest.status === "Ended" && (
    <p className="mt-3 text-red-600 font-semibold">
      Contest Finished
    </p>
  )}

</div>

             <button
  disabled={contest.status === "Ended"}
  onClick={() => {
    if (contest.status === "Upcoming") {
      registerContest(contest._id);
    } else if (contest.status === "Running") {
      navigate(`/contest/${contest._id}`);
    }
  }}
  className={`mt-5 px-6 py-2 rounded-lg text-white ${
    contest.status === "Running"
      ? "bg-green-600 hover:bg-green-700"
      : registered
      ? "bg-gray-500"
      : "bg-blue-600 hover:bg-blue-700"
  }`}
>
  {contest.status === "Upcoming"
    ? registered
      ? "Registered ✓"
      : "Register"
    : contest.status === "Running"
    ? "Enter Contest"
    : "View Leaderboard"}
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