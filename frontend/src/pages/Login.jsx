import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Button from "../components/Button";
import { HiEye, HiEyeSlash } from "react-icons/hi2";

import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await api.post("/auth/login", {
        email: email.trim().toLowerCase(),
        password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      alert("Login Successful!");
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Login Failed");
    }
  };

  return (
   <div className="min-h-[92vh] bg-[#050816] relative overflow-hidden flex items-center justify-center py-8">

      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-purple-600/25 blur-[150px] rounded-full"></div>

        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-blue-500/20 blur-[150px] rounded-full"></div>
      </div>

      {/* Login Card */}
      <div
className="
relative
w-full
max-w-[500px]
rounded-3xl
border border-slate-700/60
bg-slate-900/70
backdrop-blur-xl
shadow-[0_25px_80px_rgba(0,0,0,.45)]
px-8
py-8
"
>
        <h1 className="text-3xl font-bold text-center text-white mb-3">
          Welcome Back
        </h1>

        <p className="text-center text-slate-400 mt-3 mb-10">
          Sign in to continue your coding journey.
        </p>

       <form
  onSubmit={handleLogin}
  className="space-y-5 mt-8"
>
  {/* Email */}
  <div className="space-y-3">
    <label className="block text-sm font-medium text-slate-300">
      Email
    </label>

    <input
      type="email"
      placeholder="Email address"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="
      w-full
      h-14
      rounded-xl
      border
      border-slate-700
      bg-slate-800/50
      px-5
      text-white
      placeholder:text-slate-500
      outline-none
      focus:border-cyan-400
      focus:ring-4
      focus:ring-cyan-500/15
      "
    />
  </div>

  {/* Password */}
  <div className="space-y-3">
    <label className="block text-sm font-medium text-slate-300">
      Password
    </label>

    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="
        w-full
        h-14
        rounded-xl
        border
        border-slate-700
        bg-slate-800/50
        px-5
        pr-14
        text-white
        placeholder:text-slate-500
        outline-none
        focus:border-cyan-400
        focus:ring-4
        focus:ring-cyan-500/15
        "
      />

      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
      >
        {showPassword ? (
          <HiEyeSlash size={22} />
        ) : (
          <HiEye size={22} />
        )}
      </button>
    </div>
  </div>

  {/* Remember + Forgot */}
  <div className="flex items-center justify-between pt-2">
    <label className="flex items-center gap-2 text-sm text-slate-400">
      <input
        type="checkbox"
        className="w-4 h-4 accent-cyan-500 rounded"
      />
      Remember me
    </label>

    <button
      type="button"
      className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
    >
      Forgot Password?
    </button>
  </div>

  {/* Button */}
  <div className="pt-4">
    <Button type="submit">
      Sign In
    </Button>
  </div>
</form>
   
        {/* Divider */}
<div className="flex items-center gap-4 mt-8 mb-6">
  <div className="flex-1 h-px bg-slate-700"></div>

  <div className="flex-1 h-px bg-slate-700"></div>
</div>

{/* Register */}
<p className="text-center text-sm text-slate-400 mt-6">
  Don't have an account?
  <button
    onClick={() => navigate("/register")}
    className="ml-2 font-semibold text-cyan-400 hover:text-cyan-300"
  >
    Create Account
  </button>
</p>
      </div>
    </div>
  );
}
export default Login;