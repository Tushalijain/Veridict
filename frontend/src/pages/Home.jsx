import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50">

      {/* Navbar */}
      <nav className="flex justify-end items-center px-10 py-6">

        <div className="flex items-center gap-5">

          <Link
            to="/login"
            className="text-gray-700 hover:text-teal-600 font-medium transition duration-200"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="bg-teal-500 text-white px-5 py-2 rounded-lg hover:bg-teal-600 transition duration-300 shadow-md"
          >
            Register
          </Link>

        </div>

      </nav>

      {/* Hero Section */}

      <section className="max-w-7xl mx-auto px-8 py-24 flex flex-col items-center text-center">

        <h1 className="text-8xl md:text-8xl font-extrabold text-slate-800 tracking-tight">
          Veridict
        </h1>

        <p className="text-2xl text-teal-600 font-semibold mt-5">
          Verify. Code. Conquer.
        </p>

        <p className="mt-8 max-w-3xl text-gray-600 text-lg leading-8">
          Practice coding challenges, compete in contests, receive AI-powered
          code reviews, and climb the leaderboard — all in one platform.
        </p>

        <div className="mt-12">

          <Link
            to="/register"
            className="bg-teal-500 hover:bg-teal-600 text-white px-12 py-5 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Get Started
          </Link>

        </div>

      </section>

{/* Statistics */}

<section className="max-w-7xl mx-auto px-8 pb-24">

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

    {/* Problems */}

    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-8 text-center">

      <h2 className="text-5xl font-extrabold text-teal-600">
        150+
      </h2>

      <p className="mt-3 text-lg font-semibold text-gray-700">
        Problems
      </p>

    </div>

    {/* Submissions */}

    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-8 text-center">

      <h2 className="text-5xl font-extrabold text-blue-600">
        1000+
      </h2>

      <p className="mt-3 text-lg font-semibold text-gray-700">
        Submissions
      </p>

    </div>

    {/* Users */}

    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-8 text-center">

      <h2 className="text-5xl font-extrabold text-purple-600">
        500+
      </h2>

      <p className="mt-3 text-lg font-semibold text-gray-700">
        Users
      </p>

    </div>

    {/* Contests */}

    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-8 text-center">

      <h2 className="text-5xl font-extrabold text-orange-500">
        25+
      </h2>

      <p className="mt-3 text-lg font-semibold text-gray-700">
        Contests
      </p>

    </div>

  </div>

</section>

{/* Why Veridict */}

<section className="bg-white py-32">

  <div className="max-w-7xl mx-auto px-8">

    <h2 className="text-5xl font-bold text-center text-slate-800">
      Why Veridict?
    </h2>

    <p className="text-center text-gray-500 mt-4 text-lg">
      Everything you need to improve your programming skills.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">

      {/* Feature 1 */}

      <div className="bg-slate-50 rounded-2xl p-8 text-center hover:-translate-y-2 hover:shadow-xl transition-all duration-300">

        <div className="text-5xl">⚡</div>

        <h3 className="text-2xl font-bold mt-6">
          Online Compiler
        </h3>

        <p className="text-gray-600 mt-4">
          Compile and execute Python, Java, C and C++ instantly with custom input support.
        </p>

      </div>

      {/* Feature 2 */}

      <div className="bg-slate-50 rounded-2xl p-8 text-center hover:-translate-y-2 hover:shadow-xl transition-all duration-300">

        <div className="text-5xl">🤖</div>

        <h3 className="text-2xl font-bold mt-6">
          AI Review
        </h3>

        <p className="text-gray-600 mt-4">
          Receive intelligent feedback to improve your code quality and logic.
        </p>

      </div>

      {/* Feature 3 */}

      <div className="bg-slate-50 rounded-2xl p-8 text-center hover:-translate-y-2 hover:shadow-xl transition-all duration-300">

        <div className="text-5xl">🏆</div>

        <h3 className="text-2xl font-bold mt-6">
          Coding Contests
        </h3>

        <p className="text-gray-600 mt-4">
          Participate in exciting coding contests and test your skills under pressure.
        </p>

      </div>

      {/* Feature 4 */}

      <div className="bg-slate-50 rounded-2xl p-8 text-center hover:-translate-y-2 hover:shadow-xl transition-all duration-300">

        <div className="text-5xl">📈</div>

        <h3 className="text-2xl font-bold mt-6">
          Leaderboard
        </h3>

        <p className="text-gray-600 mt-4">
          Compete with other developers and climb the rankings through consistent practice.
        </p>

      </div>

    </div>

  </div>

</section>

{/* How It Works */}

<section className="py-32 bg-gradient-to-r from-slate-50 to-teal-50">

  <div className="max-w-7xl mx-auto px-8">

    <h2 className="text-5xl font-bold text-center text-slate-800">
      How It Works
    </h2>

    <p className="text-center text-gray-500 mt-4 text-lg">
      Start coding in just three simple steps.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-16">

      {/* Step 1 */}

      <div className="bg-white rounded-2xl shadow-md p-8 text-center hover:shadow-xl transition duration-300">

        <div className="w-16 h-16 rounded-full bg-teal-500 text-white flex items-center justify-center text-2xl font-bold mx-auto">
          1
        </div>

        <h3 className="text-2xl font-bold mt-6">
          Register
        </h3>

        <p className="text-gray-600 mt-4">
          Create your free Veridict account and start your coding journey.
        </p>

      </div>

      {/* Step 2 */}

      <div className="bg-white rounded-2xl shadow-md p-8 text-center hover:shadow-xl transition duration-300">

        <div className="w-16 h-16 rounded-full bg-blue-500 text-white flex items-center justify-center text-2xl font-bold mx-auto">
          2
        </div>

        <h3 className="text-2xl font-bold mt-6">
          Solve Problems
        </h3>

        <p className="text-gray-600 mt-4">
          Practice algorithmic challenges and improve your programming skills.
        </p>

      </div>

      {/* Step 3 */}

      <div className="bg-white rounded-2xl shadow-md p-8 text-center hover:shadow-xl transition duration-300">

        <div className="w-16 h-16 rounded-full bg-purple-500 text-white flex items-center justify-center text-2xl font-bold mx-auto">
          3
        </div>

        <h3 className="text-2xl font-bold mt-6">
          Grow
        </h3>

        <p className="text-gray-600 mt-4">
          Receive AI feedback, participate in contests, and climb the leaderboard.
        </p>

      </div>

    </div>

  </div>

</section>

{/* Footer */}

<footer className="bg-slate-900 text-white py-16">

  <div className="max-w-7xl mx-auto px-8">

    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

      {/* Brand */}

      <div>

        <h2 className="text-3xl font-bold text-teal-400">
          Veridict
        </h2>

        <p className="mt-4 text-gray-400 leading-7">
          Practice coding, compete in contests,
          improve with AI reviews,
          and become a better programmer every day.
        </p>

      </div>

      {/* Quick Links */}

      <div>

        <h3 className="text-xl font-semibold mb-5">
          Quick Links
        </h3>

        <div className="flex flex-col gap-3">

          <Link
            to="/login"
            className="text-gray-400 hover:text-teal-400"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="text-gray-400 hover:text-teal-400"
          >
            Register
          </Link>

        </div>

      </div>

      {/* Contact */}

      <div>

        <h3 className="text-xl font-semibold mb-5">
          Contact
        </h3>

        <a
  href="mailto:youremail@gmail.com"
  className="text-gray-400 hover:text-teal-400 block"
>
  📧 tushalijain1234@gmail.com
</a>

        <a
  href="https://github.com/Tushalijain"
  target="_blank"
  rel="noopener noreferrer"
  className="text-gray-400 hover:text-teal-400 block mt-2"
>
  👤 GitHub Profile
</a>

<a
  href="https://github.com/Tushalijain/Online_Judge_Project"
  target="_blank"
  rel="noopener noreferrer"
  className="text-gray-400 hover:text-teal-400 block mt-2"
>
  💻 View Project
</a>

      </div>

    </div>

    <hr className="my-10 border-slate-700" />

    <div className="text-center text-gray-500">

      © 2026 Veridict. All Rights Reserved.

    </div>

  </div>

</footer>

    </div>
  );
}

export default Home;