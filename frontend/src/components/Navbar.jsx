import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logo.png";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    setShowProfileMenu(false);
    setMobileMenuOpen(false);

    navigate("/login");
  };

  const navItems = [
    ["/dashboard", "Dashboard"],
    ["/problems", "Problems"],
    ["/submissions", "Submissions"],
    ["/contests", "Contests"],
    ["/leaderboard", "Leaderboard"],
    ["/profile", "Profile"],
  ];

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-xl bg-slate-900/80 border-b border-slate-700">
      <div className="max-w-[1500px] mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-10 py-3 sm:py-4">

        {/* Logo */}
        <Link
          to="/"
          onClick={closeMobileMenu}
          className="flex items-center gap-3 shrink-0"
        >
          <img
            src={logo}
            alt="Veridict Logo"
            className="w-10 h-10 sm:w-11 sm:h-11 object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1 lg:gap-2">
          {navItems.map(([path, label]) => (
            <Link
              key={path}
              to={path}
              className={`px-3 lg:px-4 py-2 rounded-xl transition-all duration-300 whitespace-nowrap ${
                location.pathname === path
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              {label}
            </Link>
          ))}

          {/* Profile Button */}
          <div className="relative ml-2">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-10 h-10 rounded-full bg-cyan-600 flex items-center justify-center text-white font-bold hover:bg-cyan-500 transition"
            >
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </button>

            {/* Desktop Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 top-12 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-xl overflow-hidden z-50">

                <div className="px-5 py-4 border-b border-slate-700">
                  <p className="text-white font-semibold truncate">
                    {user?.name || "User"}
                  </p>

                  <p className="text-slate-400 text-sm truncate">
                    {user?.email || ""}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate("/profile");
                  }}
                  className="w-full text-left px-5 py-3 text-slate-300 hover:bg-slate-800 transition"
                >
                  👤 My Profile
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-5 py-3 text-red-400 hover:bg-red-500/10 transition"
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg text-white hover:bg-slate-700 transition"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-700 bg-slate-900/95 backdrop-blur-xl">
          <div className="px-4 py-4 space-y-2">

            {navItems.map(([path, label]) => (
              <Link
                key={path}
                to={path}
                onClick={closeMobileMenu}
                className={`block w-full px-4 py-3 rounded-xl transition ${
                  location.pathname === path
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-700 hover:text-white"
                }`}
              >
                {label}
              </Link>
            ))}

            {/* Mobile Profile Section */}
            <div className="border-t border-slate-700 pt-3 mt-3">

              <div className="px-4 py-3">
                <p className="text-white font-semibold truncate">
                  {user?.name || "User"}
                </p>

                <p className="text-slate-400 text-sm truncate">
                  {user?.email || ""}
                </p>
              </div>

              <button
                onClick={() => {
                  closeMobileMenu();
                  navigate("/profile");
                }}
                className="w-full text-left px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-700 transition"
              >
                👤 My Profile
              </button>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;