import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";


function Navbar() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="bg-slate-800 shadow-md text-white px-8 py-4 flex justify-between items-center">
     <Link to="/" className="flex flex-col">
  <h1 className="text-3xl font-extrabold tracking-wide text-teal-600">
    Veridict
  </h1>

  <span className="text-xs text-gray-500 tracking-widest uppercase">
    Verify. Code. Conquer.
  </span>
</Link>

      <div className="flex items-center gap-6">

        <Link to="/dashboard" className="text-white hover:text-teal-300">Dashboard</Link>

        <Link to="/problems" className="text-white hover:text-teal-300">Problems</Link>

        <Link to="/submissions" className="text-white hover:text-teal-300">Submissions</Link>

        <Link to="/leaderboard" className="text-white hover:text-teal-300">Leaderboard</Link>

        <Link to="/profile" className="text-white hover:text-teal-300">Profile</Link>

        <Link to="/contests" className="text-white hover:text-teal-300">Contests</Link>

        {/* Profile */}
        <div
          className="relative cursor-pointer"
          onClick={() => setShowMenu(!showMenu)}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center font-bold text-lg">
              {user?.name?.charAt(0).toUpperCase()}
            </div>

            <div className="flex flex-col">
              <span className="font-semibold">
                {user?.name}
              </span>

              <span className="text-gray-300">
                {user?.email}
              </span>
            </div>
          </div>

          {showMenu && (
            <div className="absolute right-0 mt-3 w-56 bg-white rounded-lg shadow-xl text-black overflow-hidden z-50">

              <div className="p-4 border-b">
                <p className="font-semibold">{user?.name}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>

              <Link
                to="/submissions"
                className="block px-4 py-3 hover:bg-gray-100"
              >
                📜 Submission History
              </Link>

              <button
                onClick={logout}
                className="w-full text-left px-4 py-3 hover:bg-red-50 text-red-600"
              >
                🚪 Logout
              </button>

            </div>
          )}
        </div>

      </div>
    </nav>
  );
}

export default Navbar;