import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Button from "../components/Button";
import { HiEye, HiEyeSlash } from "react-icons/hi2";

import { FcGoogle } from "react-icons/fc";
import axios from "axios";

function Register() {
  const navigate = useNavigate();

 

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      alert("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      alert("Registration Successful!");

      navigate("/dashboard");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Registration Failed"
      );
    }
  };

  return (
    <div className="min-h-[92vh] bg-[#050816] relative overflow-hidden flex items-center justify-center py-8">

      {/* Background Glow */}

      <div className="absolute inset-0 overflow-hidden">

        <div className="absolute -top-52 -right-52 w-[520px] h-[520px] bg-cyan-500/20 blur-[160px] rounded-full"></div>

        <div className="absolute -bottom-52 -left-52 w-[520px] h-[520px] bg-purple-600/20 blur-[160px] rounded-full"></div>

      </div>

      {/* Card */}

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

        <h1 className="text-4xl font-bold text-center text-white mb-3">
          Create Account
        </h1>

        <p className="text-center text-slate-400 mt-3 mb-10">
          Join Veridict and start your coding journey.
        </p>

       <form className="space-y-5">

          {/* Full Name */}

          <div>

            <label className="block text-sm font-medium text-slate-300 mb-2">
              Full Name
            </label>

<div className="px-2">
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="
                w-full
                h-12
                rounded-xl
                border
                border-slate-700
                bg-slate-800/60
                px-5
                text-white
                placeholder:text-slate-500
                outline-none
                focus:border-cyan-400
                focus:ring-4
                focus:ring-cyan-500/10
              "
            />
            </div>

          </div>

          {/* Email */}

          <div>

            <label className="block text-sm font-medium text-slate-300 mb-2">
              Email
            </label>

<div className="px-2">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="
                w-full
                h-12
                rounded-xl
                border
                border-slate-700
                bg-slate-800/60
                px-5
                text-white
                placeholder:text-slate-500
                outline-none
                focus:border-cyan-400
                focus:ring-4
                focus:ring-cyan-500/10
              "
            />
            </div>

          </div>

                    {/* Password */}

          <div>

            <label className="block text-sm font-medium text-slate-300 mb-2">
              Password
            </label>

            <div className="relative">

<div className="px-2">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                className="
                  w-full
                  h-12
                  rounded-xl
                  border
                  border-slate-700
                  bg-slate-800/60
                  px-5
                  pr-14
                  text-white
                  placeholder:text-slate-500
                  outline-none
                  focus:border-cyan-400
                  focus:ring-4
                  focus:ring-cyan-500/10
                "
              />
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
              >
                {showPassword ? (
                  <HiEyeSlash size={20} />
                ) : (
                  <HiEye size={20} />
                )}
              </button>

            </div>

          </div>

          {/* Confirm Password */}

          <div>

            <label className="block text-sm font-medium text-slate-300 mb-2">
              Confirm Password
            </label>

            <div className="relative">

<div className="px-2">
              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                className="
                  w-full
                  h-12
                  rounded-xl
                  border
                  border-slate-700
                  bg-slate-800/60
                  px-5
                  pr-14
                  text-white
                  placeholder:text-slate-500
                  outline-none
                  focus:border-cyan-400
                  focus:ring-4
                  focus:ring-cyan-500/10
                "
              />
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
              >
                {showConfirmPassword ? (
                  <HiEyeSlash size={20} />
                ) : (
                  <HiEye size={20} />
                )}
              </button>

            </div>

          </div>

          {/* Create Account Button */}

          <div className="px-2 pt-2">

            <Button type="submit">
              Create Account
            </Button>

          </div>

        </form>

        {/* Divider */}

        <div className="flex items-center gap-4 my-8">

          <div className="flex-1 h-px bg-slate-700"></div>

          <span className="text-slate-500 text-sm">
            OR
          </span>

          <div className="flex-1 h-px bg-slate-700"></div>

        </div>

        {/* Google Button */}
{/* <div className="px-2 pt-2">
       <Button
  type="button"
  variant="secondary"
  onClick={handleGoogleRegister}
>
  <FcGoogle className="text-xl" />
  Sign up with Google
</Button>
        </div> */}

                {/* Login */}

        <p className="text-center text-sm text-slate-400 mt-8">

          Already have an account?

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="
              ml-2
              font-semibold
              text-cyan-400
              hover:text-cyan-300
              transition-colors
            "
          >
            Sign In
          </button>

        </p>

      </div>

    </div>

  );
}

export default Register;