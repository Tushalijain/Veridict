function AIReview() {
  return (
    <section className="max-w-7xl mx-auto px-8 py-24">

      <div className="grid lg:grid-cols-2 gap-16 items-center">

        {/* LEFT */}

        <div>

          <p className="uppercase tracking-[0.35em] text-cyan-400 font-semibold">
            AI ASSISTANT
          </p>

          <h2 className="text-5xl font-black text-white mt-4">
            Review Your Code
            <span className="text-cyan-400"> Instantly</span>
          </h2>

          <p className="text-slate-400 mt-8 leading-8 text-lg">
            Veridict AI analyzes your solution, detects inefficient logic,
            explains mistakes, and recommends optimized approaches just like
            an experienced interviewer.
          </p>

          <button className="mt-10 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold hover:scale-105 transition">
            Try AI Review
          </button>

        </div>

        {/* RIGHT */}

        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 shadow-2xl">

          {/* User */}

          <div className="flex justify-end mb-6">

            <div className="bg-cyan-500 text-white px-5 py-3 rounded-2xl max-w-sm">
              How can I optimize my Two Sum solution?
            </div>

          </div>

          {/* AI */}

          <div className="flex">

            <div className="bg-slate-800 text-slate-300 px-5 py-4 rounded-2xl max-w-md">

              <p className="text-cyan-400 font-semibold mb-3">
                🤖 Veridict AI
              </p>

              <p>
                Your current solution uses nested loops.
              </p>

              <p className="mt-2">
                Complexity:
                <span className="text-red-400"> O(n²)</span>
              </p>

              <p className="mt-4">
                Recommendation:
              </p>

              <p className="text-green-400">
                ✔ Use a HashMap
              </p>

              <p className="mt-2">
                Optimized Complexity:
                <span className="text-green-400"> O(n)</span>
              </p>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default AIReview;