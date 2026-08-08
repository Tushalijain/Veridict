import { useEffect, useState } from "react";
import api from "../services/api";


function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      const response = await api.get(`/profile/${user._id}`);

      setProfile(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const last35Days = [];

const today = new Date();

for (let i = 34; i >= 0; i--) {
  const d = new Date(today);
  d.setDate(today.getDate() - i);
  last35Days.push(new Date(d));
}

const weeks = [];

for (let i = 0; i < last35Days.length; i += 7) {
  weeks.push(last35Days.slice(i, i + 7));
}

  if (!profile) {
    return (
      <>
        
        <h2 className="text-center mt-10">Loading...</h2>
      </>
    );
  }

const { user, stats } = profile;


for (let i = 34; i >= 0; i--) {

  const date = new Date();

  date.setDate(date.getDate() - i);

  last35Days.push(date.toISOString().split("T")[0]);

}

  return (
    <>
      

      <div className="min-h-screen bg-slate-950 text-white px-8 py-10">

        <div
  className="
    max-w-6xl
    mx-auto
    rounded-3xl
    border
    border-slate-700
    bg-slate-900/60
    backdrop-blur-xl
    shadow-2xl
    p-10
  "
>

          <h1 className="text-5xl font-extrabold mb-10">
  👤 My Profile
</h1>

          <div className="flex items-center justify-between mb-8">

  <div>

    <h2 className="text-3xl font-bold">
      {user.name}
    </h2>

    <p className="text-slate-300">
      {user.email}
    </p>

    <p className="text-sm text-slate-500 mt-2">
      Member since {new Date(user.createdAt).toLocaleDateString()}
    </p>

  </div>

  <div
  className="
    rounded-2xl
    bg-slate-800/60
    border
    border-orange-500/30
    px-8
    py-6
    text-center
  "
>

    <p className="text-orange-400 font-semibold text-lg">
      🔥 Current Streak
    </p>

    <p className="text-3xl font-bold">
      {user.currentStreak}
    </p>

    <p className="text-slate-400 mt-2">
      Best: {user.longestStreak} Days
    </p>

  </div>

</div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
             <div className="rounded-2xl bg-yellow-500/10 border border-yellow-500/30 p-6 text-center">
  <h3 className="text-slate-400 text-sm uppercase tracking-wide">
    Acceptance
  </h3>
  <p className="text-3xl font-bold text-yellow-400 mt-2">
    {stats.acceptanceRate}%
  </p>
</div>

           <div className="rounded-2xl bg-cyan-500/10 border border-cyan-500/30 p-6 text-center">
  <h3 className="text-slate-400 text-sm uppercase tracking-wide">
    Solved
  </h3>
  <p className="text-4xl font-bold text-cyan-400 mt-2">
    {stats.solved}
  </p>
</div>

<div className="rounded-2xl bg-green-500/10 border border-green-500/30 p-6 text-center">
  <h3 className="text-slate-400 text-sm uppercase tracking-wide">
    Accepted
  </h3>
  <p className="text-4xl font-bold text-green-400 mt-2">
    {stats.accepted}
  </p>
</div>

<div className="rounded-2xl bg-red-500/10 border border-red-500/30 p-6 text-center">
  <h3 className="text-slate-400 text-sm uppercase tracking-wide">
    Wrong
  </h3>
  <p className="text-4xl font-bold text-red-400 mt-2">
    {stats.wrongAnswer}
  </p>
</div>

<div className="mb-10">

  <h2 className="text-3xl font-bold mb-6">
    🏆 Achievements
  </h2>

  <div className="flex flex-wrap gap-4">

    {user.badges.length === 0 ? (

      <p className="text-slate-400">
        No badges earned yet.
      </p>

    ) : (

      user.badges.map((badge, index) => (

        <div
          key={index}
          className="
px-5
py-3
rounded-xl
bg-yellow-500/20
border
border-yellow-500/30
text-yellow-300
font-semibold
hover:scale-105
transition
"
        >
          🏅 {badge}
        </div>
      ))
    )}
  </div>
</div>

          </div>

          <div className="mt-10 rounded-2xl border border-slate-700 bg-slate-800/50 overflow-hidden">

            <table className="w-full">

              <tbody>

                <tr className="border-b border-slate-700 hover:bg-slate-800/70 transition">
                  <td className="px-6 py-4 font-semibold text-slate-300">Total Submissions</td>
                  <td>{stats.totalSubmissions}</td>
                </tr>

                <tr className="border-b border-slate-700 hover:bg-slate-800/70 transition">
                  <td className="px-6 py-4 font-semibold text-slate-300">Compilation Errors</td>
                  <td>{stats.compilationError}</td>
                </tr>

                <tr className="border-b border-slate-700 hover:bg-slate-800/70 transition">
                  <td className="px-6 py-4 font-semibold text-slate-300">Runtime Errors</td>
                  <td>{stats.runtimeError}</td>
                </tr>

                <tr className="border-b border-slate-700 hover:bg-slate-800/70 transition">
                  <td className="px-6 py-4 font-semibold text-slate-300">Time Limit Exceeded</td>
                  <td>{stats.timeLimitExceeded}</td>
                </tr>

              </tbody>

            </table>

{/* ======================= Coding Activity ======================= */}

<div className="mt-12">

  <div className="rounded-2xl border border-slate-700 bg-slate-800/50 p-8">

    {/* Header */}

    <div className="flex justify-between items-center mb-8">

      <div>

        <h2 className="text-3xl font-bold">
          📅 Coding Activity
        </h2>

        <p className="text-slate-400 mt-1">
          Last 35 Days
        </p>

      </div>

      <div className="text-right">

        <p className="text-slate-400 text-sm">
          Active Days
        </p>

        <p className="text-3xl font-bold text-green-400">
          {Object.keys(stats.heatmap || {}).length}
        </p>

      </div>

    </div>

    {/* Heatmap */}

    <div className="flex justify-center gap-6">

      {/* Days */}

      <div className="flex flex-col gap-2 mt-1">

        {dayLabels.map((day) => (

          <div
            key={day}
            className="h-6 flex items-center text-sm text-slate-400"
          >
            {day}
          </div>

        ))}

      </div>

      {/* Grid */}

      <div className="flex gap-2">

        {weeks.map((week, weekIndex) => (

          <div
            key={weekIndex}
            className="flex flex-col gap-2"
          >

            {week.map((date) => {

              const key = date
                .toISOString()
                .split("T")[0];

              const count =
                stats.heatmap?.[key] || 0;

              let color = "bg-slate-700";

              if (count >= 1)
                color = "bg-green-500/40";

              if (count >= 2)
                color = "bg-green-500";

              if (count >= 4)
                color = "bg-green-400";

              return (

                <div
                  key={key}
                  title={`${key}\nSolved: ${count}`}
                  className={`
                    w-6
                    h-6
                    rounded-md
                    ${color}
                    hover:scale-125
                    hover:ring-2
                    hover:ring-cyan-400
                    transition-all
                    duration-200
                    cursor-pointer
                  `}
                />

              );

            })}

          </div>

        ))}

      </div>

    </div>

    {/* Footer */}

    <div className="flex justify-center gap-12 mt-8">

      <div>

        <span className="text-slate-400">
          🔥 Current Streak
        </span>

        <span className="ml-2 font-bold text-orange-400">
          {user.currentStreak} days
        </span>

      </div>

      <div>

        <span className="text-slate-400">
          🏆 Longest Streak
        </span>

        <span className="ml-2 font-bold text-yellow-400">
          {user.longestStreak} days
        </span>

      </div>

    </div>

  </div>

</div>
      </div>
      </div>
      </div>
    </>
  );
}

export default Profile;