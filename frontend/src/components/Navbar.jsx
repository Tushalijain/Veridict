import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import { FaCode } from "react-icons/fa6";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const location = useLocation();
 const user = JSON.parse(localStorage.getItem("user") || "{}");
 const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navItem = (path, label) => (
    <Link
      to={path}
      className={`px-4 py-2 rounded-xl transition-all duration-300 ${
        location.pathname === path
          ? "bg-blue-600 text-white"
          : "text-slate-300 hover:bg-slate-700 hover:text-white"
      }`}
    >
      {label}
    </Link>
  );
  const navigate = useNavigate();

const handleLogout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  navigate("/login");
};

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/80 border-b border-slate-700">

      <div className="max-w-[1500px] mx-auto flex items-center justify-between px-10 py-4">

        {/* Logo */}
        <div className="flex items-center gap-3">

          <img
  src={logo}
  alt="Veridict Logo"
  className="w-11 h-11 object-contain"
/>

<h1 className="text-2xl font-black tracking-wide text-white">
  Veridict
</h1>

        </div>

        {/* Navigation */}

       <div className="flex gap-2">

  {navItem("/dashboard", "Dashboard")}
  {navItem("/problems", "Problems")}
  {navItem("/submissions", "Submissions")}
  {navItem("/contests", "Contests")}
  {navItem("/leaderboard", "Leaderboard")}
  {navItem("/profile", "Profile")}

</div>

{/* Right Side */}
<div className="relative">

  <button
    onClick={() => setShowProfileMenu(!showProfileMenu)}
    className="w-10 h-10 rounded-full bg-cyan-600 flex items-center justify-center text-white font-bold"
  >
    {user?.name?.charAt(0)?.toUpperCase() || "U"}
  </button>

  {showProfileMenu && (
    <div
      className="
        absolute
        right-0
        mt-3
        w-64
        bg-slate-900
        border
        border-slate-700
        rounded-2xl
        shadow-xl
        overflow-hidden
        z-50
      "
    >
      <div className="px-5 py-4 border-b border-slate-700">
        <h3 className="font-bold text-white">
          {user?.name}
        </h3>

        <p className="text-slate-400 text-sm">
          {user?.email}
        </p>
      </div>

      <button
        onClick={() => navigate("/profile")}
        className="
          w-full
          text-left
          px-5
          py-3
          hover:bg-slate-800
          transition
        "
      >
        👤 My Profile
      </button>

      <button
        onClick={handleLogout}
        className="
          w-full
          text-left
          px-5
          py-3
          text-red-400
          hover:bg-red-500/10
          transition
        "
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